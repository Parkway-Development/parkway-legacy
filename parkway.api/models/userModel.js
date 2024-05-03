const mongoose = require('mongoose');

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
        ref: 'Profile'
    },    
    applicationClaims: [{
        name: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        },
        _id: false
    }],
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
}, {timestamps: true})

module.exports = mongoose.model('User', userSchema, 'users')