const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

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
    const hash = await bcrypt.hash(resetToken, 10);

    // Set token and expiration on user model
    user.resetPasswordToken = hash;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
    console.log('resetToken: ', resetToken)
    console.log('hashedResetToken: ', user.resetPasswordToken)
    console.log('resetTokenExpires: ', user.resetPasswordExpires)

    await user.save();

    return resetToken;
};

module.exports = { 
    validatePassword, 
    hashPassword, 
    validateEmail,
    createToken,
    generatePasswordResetToken
};