const User = require('../models/userModel')
const Profile = require('../models/profileModel')
const Organization = require('../models/organizationModel')
const ApplicationClaim = require('../models/applicationClaimModel')
const bcrypt = require('bcrypt');
const removeSensitiveData = require('../helpers/objectSanitizer');
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../helpers/sendgdrid');
const appError = require('../applicationErrors');
const { validatePassword, 
    hashPassword, 
    validateEmail,
    createToken,
    generatePasswordResetToken
 } = require('../helpers/userValidation');

const loginUser = async (req, res, next) => {
    try {
        const {email, password, organizationId} = req.body
        if(!email || !password || !organizationId ) { throw new appError.MissingRequiredParameter('signupUser','Email, Password, and Organization Id are required.') }
    
        const organization = await Organization.findById(organizationId);
        if(!organization) { throw new appError.OrganizationDoesNotExist('loginUser') }

        let activeUser = await User.findOne({email}).populate('applicationClaims');
        if (!activeUser) { throw new appError.UserDoesNotExist('loginUser') } 

        console.log({message: `${email} attempting to log in.`})

        let validUserOrganizationPair = false;
        for(let i = 0; i < activeUser.organizations.length; i++){
            if(activeUser.organizations[i].organizationId.toString() === organizationId){
                validUserOrganizationPair = true;
                activeUser.organizations[i].isActive = true;
            }
        }
        if(!validUserOrganizationPair) { throw new appError.UserDoesNotBelongToOrganization('loginUser') }

        const authenticate = await bcrypt.compare(password, activeUser.password)
        if(!authenticate) { throw new appError.FailedLogin('loginUser') }

        const profile = await Profile.findOne({email})
            .populate('teams')
            .populate('family')
            .populate('preferences');

        if (profile) {
            const token = createToken(activeUser, profile);
            return res.status(200).json({email: email, token: token, profile: profile});
        }

        const token = createToken(activeUser);
        console.log({message: `${email} logged in.`})
        return res.status(200).json({email: email, token: token, message: 'No profile found'});
    } catch (error) {
        next(error);
        console.log({ method: error.method, message: error.message });
    }
}

const signupUser = async (req, res, next) => {
    try {
        const {email, password, organizationId} = req.body
        if(!email || !password || !organizationId ) { throw new appError.MissingRequiredParameter('signupUser','Email, Password, and Organization Id are required.') }
    
        if(!validateEmail(email)) { throw new appError.Validation('signupUser', 'Invalid email') }
    
        const userExists = await User.findOne({email})
        if(userExists) { throw new appError.DuplicateEmail('signupUser') }
    
        const passwordIsValid = validatePassword(password)
        if (!passwordIsValid) { throw new appError.PasswordStrength('signupUser'); }

        const organization = await Organization.findById(organizationId);
        if(!organization) { throw new appError.OrganizationDoesNotExist('signupUser') }

        let newUser = new User({
            email: email,
            password: await hashPassword(password),
            organizations: [{ organizationId, isDefault: true, isActive: true }],
            applicationClaims: [{ name: 'role', value: 'user' }]  // Manually setting the claim here
        });

        await newUser.save();
        
        const token = createToken(newUser)

        //check to see if there is a matching profile
        const profile = await Profile.findOne({email})

        if(profile){
            return res.status(201).json({email: email, token: token, profile: profile});
        }

        return res.status(200).json({email: email, token: token, message: 'No profile found'});
    
    } catch (error) {
        next(error);
        console.log({ method: error.method, message: error.message });
    }
}

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({});

        if(users.length === 0){ return res.status(204).json({ message: 'No users found.' }) }

        return res.status(200).json(removeSensitiveData(users));

    } catch (error) {
        next(error);
        console.log({ method: error.method, message: error.message });
    }
};

const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if(!id) { throw new appError.MissingId('getUserById') }
        if(!mongoose.Types.ObjectId.isValid(id)) { throw new appError.InvalidId('getUserById') }
    
        const user = await User.findById(id)
        if(!user){ return res.status(204).json({ message: 'No user found.' }) }

        return res.status(200).json(removeSensitiveData(user))
    
    } catch (error) {
        next(error);
        console.log({ method: error.method, message: error.message });
    }
};

const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        if(!email) { throw new appError.MissingRequiredParameter('getUserByEmail') }

        const user = await User.findOne({email})
        if(!user){ return res.status(204).json({ message: 'No user found.' }) }
    
        return res.status(200).json(removeSensitiveData(user))
    
    } catch (error) {
        next(error);
        console.log({ method: error.method, message: error.message });
    }
};

const addApplicationClaimToUser = async (req, res, next) => {
    try{
        const { id } = req.params;
        if(!id) { throw new appError.MissingId('addApplicationClaimToUser') }
        if(!mongoose.Types.ObjectId.isValid(id)) { throw new appError.InvalidId('addApplicationClaimToUser') }

        const { name, value } = req.body
        if(!name || !value) { throw new appError.MissingRequiredParameter('addApplicationClaimToUser') }
        
        const applicationClaim = await ApplicationClaim.findOne({name: name});
        if(!applicationClaim){ return res.status(204).json({ message: 'No application claim found.' }) }
        
        const user = await User.findById(id);
        if(!user){ return res.status(204).json({ message: 'No user found.' }) }

        const valueExists = applicationClaim.values.includes(value);
        if(!valueExists){ throw new appError.InvalidClaimValue('addApplicationClaimToUser') }
        
        user.applicationClaims.push({ name, value });
        await user.save({new: true});

        return res.status(200).json(removeSensitiveData(user));
    } catch (error) {
        next(error);
        console.log({ method: error.method, message: error.message });
    }
};

const requestPasswordReset = async (req, res, next) => {

    try {
        const toEmail = req.body.email;
        if (!toEmail) { throw new appError.MissingRequiredParameter('requestPasswordReset'); }

        const user = await User.findOne({ email: toEmail});
        if (!user) { throw new appError.UserDoesNotExist('requestPasswordReset'); }

        const resetToken = await generatePasswordResetToken(user);

        // Send email with reset token
        await sendPasswordResetEmail(toEmail, resetToken);

        res.status(200).json({ message: 'If we found an account that matched your email, instructions on resetting your password were forwarded to that address.' });
    } catch (error) {
        next(error);
        console.log({ method: error.method, message: error.message });
    }
};

const passwordReset = async (req, res, next) => {

    try {
        const { resetToken, password } = req.body;
        if (!resetToken || !password) { throw new appError.MissingRequiredParameter('passwordReset'); }

        const user = await User.findOne({ resetToken });
        if (!user) { throw new appError.UserDoesNotExist('passwordReset'); }

        const valid = user.resetTokenExpiration > Date.now();
        if (!valid) { throw new appError.PasswordResetTokenExpired('passwordReset'); }

        user.password = await hashPassword(password);
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();
        
        res.status(200).json({ message: 'Password successfully reset.' });
    } catch (error) {
        next(error);
        console.log({ method: error.method, message: error.message });
    }
};

module.exports = { 
    signupUser, 
    loginUser,
    requestPasswordReset,
    passwordReset,
    getAllUsers,
    getUserById,
    getUserByEmail,
    addApplicationClaimToUser
}