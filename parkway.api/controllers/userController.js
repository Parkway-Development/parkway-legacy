const User = require('../models/userModel')
const Profile = require('../models/profileModel')
const ApplicationClaim = require('../models/applicationClaimModel')
const bcrypt = require('bcrypt');
const removeSensitiveData = require('../helpers/objectSanitizer');
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../helpers/sendgdrid');
const { validatePassword, 
    hashPassword, 
    validateEmail,
    createToken,
    generatePasswordResetToken
 } = require('../helpers/userValidation');

const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body
        if(!email || !password) { throw Error('All fields are required.') }
    
        const activeUser = await User.findOne({email}).populate('applicationClaims');
        const authenticate = await bcrypt.compare(password, activeUser.password)

        if(!authenticate) { throw Error('Invalid credentials.') }

        const profile = await Profile.findOne({email})
            .populate('teams')
            .populate('family')
            .populate('preferences');

        if (profile) {
            const token = createToken(activeUser, profile);
            return res.status(200).json({email: email, token: token, profile: profile});
        }

        const token = createToken(activeUser);
        return res.status(200).json({email: email, token: token, message: 'No profile found'});
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

const signupUser = async (req, res) => {
    try {
        const {email, password} = req.body
        if(!email || !password) { throw Error('All fields are required.') }
    
        if(!validateEmail(email)) { throw Error('Invalid email') }
    
        const exists = await User.findOne({email})
        if(exists) { throw Error('Email already exists') }
    
        const isValid = validatePassword(password)
        if (!isValid) { throw Error('Password is not strong enough'); }

        let newUser = new User({
            email: email,
            password: await hashPassword(password),
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
        console.log(error)
        return res.status(400).json({error: error.message})
    }
}

const signupWixUser = async (req, res) => {
    try {
        const wixUser = req.body;
        return res.status(200).json({message: 'Wix User Signup'})
    
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});

        if(users.length === 0){ throw Error('No users found.') }

        return res.status(200).json(removeSensitiveData(users));
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        if(!id) { throw Error('No id provided.') }
        if(!mongoose.Types.ObjectId.isValid(id)) { throw Error('Invalid id.') }
    
        const user = await User.findById(id)
        if(!user){ throw Error('No user found.') }

        return res.status(200).json(removeSensitiveData(user))
    
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
};

const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        if(!email) { throw Error('No email provided.') }

        const user = await User.findOne({email})
        if(!user){throw Error('No user found.')}
    
        return res.status(200).json(removeSensitiveData(user))
    
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)        
    }
};

const addApplicationClaimToUser = async (req, res) => {
    try{
        const { id } = req.params;
        if(!id) { throw Error('No id provided.') }
        if(!mongoose.Types.ObjectId.isValid(id)) { throw Error('Invalid id.') }

        const { name, value } = req.body
        if(!name || !value) { throw Error('All fields are required.') }
        
        const applicationClaim = await ApplicationClaim.findOne({name: name});
        if(!applicationClaim){ throw Error('No such application claim found.') }
        
        const user = await User.findById(id);
        if(!user){ throw Error('No user found.') }

        const valueExists = applicationClaim.values.includes(value);
        if(!valueExists){ throw Error('Invalid value for the application claim.') }
        
        user.applicationClaims.push({ name, value });
        await user.save({new: true});
        if(!user){ throw Error('Error saving user.') }

        return res.status(200).json(removeSensitiveData(user));
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
};

const requestPasswordReset = async (req, res) => {

    try {
        const toEmail = req.body.email;
        if (!toEmail) { throw new Error('Email is required.'); }

        const user = await User.findOne({ email: toEmail});
        if (!user) { throw new Error('There was a problem resetting your password.'); }

        const resetToken = await generatePasswordResetToken(user);

        // Send email with reset token
        await sendPasswordResetEmail(toEmail, resetToken);

        res.status(200).json({ message: 'If we found an account that matched your email, instructions on resetting your password were forwarded to that address.' });
    } catch (error) {
        console.log('Error: ', error.message)
        res.status(400).json({ message: 'Check the logs for any issues.'});
    }
};

const passwordReset = async (req, res) => {

    try {
        const { resetToken, password } = req.body;
        if (!resetToken || !password) { throw new Error('All fields are required.'); }

        const user = await User.findOne({ resetToken });
        if (!user) { throw new Error('User not found. Please contact support.'); }

        // const legit = bcrypt.compare(token, user.resetToken);
        // if (!legit) { throw new Error('Invalid reset token.'); }

        const valid = user.resetTokenExpiration > Date.now();
        if (!valid) { throw new Error('Reset token has expired.'); }

        user.password = await hashPassword(password);
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();
        
        res.status(200).json({ message: 'Password successfully reset.' });
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
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
    signupWixUser,
    addApplicationClaimToUser
}