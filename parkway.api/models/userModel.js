const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

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

    const exists = await this.findOne({email})
    if(exists) {
        throw new Error('Email already exists')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = await this.create({email, password: hash})
    return user
}

module.exports = mongoose.model('User', userSchema, 'users')