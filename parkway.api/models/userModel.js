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
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        type: String
    }
}, {timestamps: true})

//static signup method
userSchema.statics.signup = async function(email, password) {

    //validation
    if(!email || !password) {
        throw Error('Right.  Like you are gonna get away with that!  I need a real email and a strong password!')
    }

    if(!validator.isEmail(email)) {
        throw Error('Yo!....how about a good email?')
    }

    if(!validator.isStrongPassword(password, [{minlength: 12, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1}])) {
        throw Error('It aint strong enough!  It has to be at least 12 characters long, and have at least 1 each of lowercase, uppercase, number, and symbol (like an * or something).  You can do it!  I believe in you!')
    }

    const exists = await this.findOne({email})
    if(exists) {
        throw Error('Email already exists')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = await this.create({email, password: hash})
    return user
}

module.exports = mongoose.model('User', userSchema, 'users')