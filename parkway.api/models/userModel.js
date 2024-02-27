const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const { log } = require('console');

const userSchema = new mongoose.Schema({
    email: {
        required: true,
        type: String,
        unique: true
    },
    password: {
        required: true,
        type: String
    },
    profileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: false
    }
}, {timestamps: true})

//static signup method
userSchema.statics.signup = async function(email, password) {

    if(!email || !password) {
        throw Error('All fields are required.')
    }

    if(!validator.isEmail(email)) {
        throw Error('Invalid email')
    }

    const length = process.env.MINIMUM_PASSWORD_LENGTH;
    const lowercase = process.env.MINIMUM_PASSWORD_LOWERCASE;
    const uppercase = process.env.MINIMUM_PASSWORD_UPPERCASE;
    const numbers = process.env.MINIMUM_PASSWORD_NUMBERS;
    const symbols = process.env.MINIMUM_PASSWORD_SYMBOLS;

    if(!validator.isStrongPassword(password, [{minlength: length, minLowercase: lowercase, minUppercase: uppercase, minNumbers: numbers, minSymbols: symbols}])) {
        throw Error('Password is not strong enough')
    }

    const exists = await this.findOne({email})
    if(exists) {
        throw Error('Email already exists')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = await this.create({email, password: hash})

    const result = user.toObject();
    delete result.password;
    return result;
}

userSchema.statics.login = async function(email, password) {

    if(!email || !password) {
        throw Error('All fields are required.')
    }

    const user = await this.findOne({email})
    if(!user) {
        throw Error('Invalid credentials.')
    }

    const authenticate = await bcrypt.compare(password, user.password)

    if(!authenticate) {
        throw Error('Invalid credentials.')
    }

    return user;
}

module.exports = mongoose.model('User', userSchema, 'users')