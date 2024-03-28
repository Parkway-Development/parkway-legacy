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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ApplicationClaim',
        required: true
    }],
    apiKey:{
        type: String,
        unique: true
    }
}, {timestamps: true})

module.exports = mongoose.model('User', userSchema, 'users')