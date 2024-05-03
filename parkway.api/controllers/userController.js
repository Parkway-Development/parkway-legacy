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
 } = require('../helpers/accountValidation');

const loginUser = async (req, res) => {
    const {email, password} = req.body

    try {
        if(!email || !password) {
            throw Error('All fields are required.')
        }
    
        const activeUser = await User.findOne({email})
            .populate('applicationClaims');

        const authenticate = await bcrypt.compare(password, activeUser.password)

        if(!authenticate) {
            throw Error('Invalid credentials.')
        }

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
        return res.status(400).json({error: error.message})
    }
}

const signupUser = async (req, res) => {
    const {email, password} = req.body
    try {
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
    
        return res.status(400).json({error: error.message})
    
    }
}

const signupWixUser = async (req, res) => {
    
    const wixUser = req.body;
    return res.status(200).json({message: 'Wix User Signup'})
}

const getAll = async (req, res) => {
    try {
        const users = await User.find({});

        if(users.length === 0){
            return res.status(404).json({message: "No users found."});
        }

        return res.status(200).json(removeSensitiveData(users));
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
};

const getById = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id)
    if(!user){
        return res.status(404).json({message: "No such user found."})
    }
    return res.status(200).json(removeSensitiveData(user))
}

const getByEmail = async (req, res) => {
    const { email } = req.params;
    const user = await User.findOne({email})
    if(!user){
        return res.status(404).json({message: "No such user found."})
    }

    return res.status(200).json(removeSensitiveData(user))
}

const addApplicationClaim = async (req, res) => {
    try{
        const { id } = req.params;
        const { name, value } = req.body
        
        console.log('id: ', id);
        console.log('name: ', name);
        console.log('value: ', value);

        // is it a legit claim
        const applicationClaim = await ApplicationClaim.findOne({name: name});
        if(!applicationClaim){
            return res.status(404).json({message: "No such application claim found."})
        }
        
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({message: "No such user found."})
        }

        const valueExists = applicationClaim.values.includes(value);
        if(!valueExists){
            return res.status(400).json({message: "Invalid value for the application claim."})
        }
        
        user.applicationClaims.push({ name, value });
        await user.save({new: true});

        return res.status(200).json(removeSensitiveData(user));
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

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
    const { token, email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+resetPasswordToken +resetPasswordExpires');

        if (!user) {
            return res.status(404).json({ error: 'User not found. Please contact support.' });
        }

        const tokenIsValid = await bcrypt.compare(token, user.resetPasswordToken);
        const tokenNotExpired = user.resetPasswordExpires > Date.now();

        if (!tokenIsValid || !tokenNotExpired) {
            const errorMessage = !tokenIsValid ? 'Invalid reset token.' : 'Reset token has expired.';
            return res.status(400).json({ error: errorMessage });
        }

        user.password = await hashPassword(password);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password successfully reset.' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
};

module.exports = { 
    signupUser, 
    loginUser,
    requestPasswordReset,
    passwordReset,
    getAll,
    getById,
    getByEmail,
    signupWixUser,
    addApplicationClaim
}