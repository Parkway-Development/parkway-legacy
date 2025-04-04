const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Profile = require('../models/profileModel');
const Account = require('../models/accounting/accountModel');

const validatePassword = (password) => {

    const pLength = process.env.MINIMUM_PASSWORD_LENGTH;
    const pLowercase = process.env.MINIMUM_PASSWORD_LOWERCASE;
    const pUppercase = process.env.MINIMUM_PASSWORD_UPPERCASE;
    const pNumbers = process.env.MINIMUM_PASSWORD_NUMBERS;
    const pSymbols = process.env.MINIMUM_PASSWORD_SYMBOLS;

    if (!validator.isStrongPassword(password, {
        minLength: pLength,
        minLowercase: pLowercase,
        minUppercase: pUppercase,
        minNumbers: pNumbers,
        minSymbols: pSymbols,
    })) {
        return false;
    }
    return true;
}

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

const validateEmail = (email) => {
    if (validator.isEmail(email)) {
        return true;
    }
    return false;
}

const createToken = (activeUser, profile) => {
    const claims = {
        teams: [],
        teamsLed: []
    };

    activeUser.applicationClaims?.forEach(({ name, value}) => {
        claims[name] = value;
    });

    if (profile?.teams) {
        profile.teams.forEach((team) => {
            if (team.leader && team.leader.equals(profile._id)) {
                claims.teamsLed.push(team._id);
            }

            claims.teams.push(team._id);
        });
    }

    const payload = {
        _id: activeUser._id,
        claims
    };

    return jwt.sign(payload,
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRATION})
}

const generatePasswordResetToken = async (user) => {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiration = Date.now() + 3600000; // 1 hour from now

    user.resetToken = resetToken;
    user.resetTokenExpiration = resetTokenExpiration
    console.log('resetToken: ', resetToken)
    // console.log('hashedResetToken: ', user.resetPasswordToken)
    console.log('resetTokenExpires: ', resetTokenExpiration)

    await user.save();

    return resetToken;
};

const profileExists = async (profileId) => {
    const profile = await Profile.findById(profileId);
    return !!profile;
}

module.exports = { 
    validatePassword, 
    hashPassword, 
    validateEmail,
    createToken,
    generatePasswordResetToken,
    profileExists
};