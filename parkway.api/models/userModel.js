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
    resetToken: {
        type: String
    },
    resetTokenExpiration: {
        type: Date
    },
    organizations: [{
        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Organization'
        },
        isDefault: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean,
            default: false
        }
    }]
}, {timestamps: true})

module.exports = mongoose.model('User', userSchema, 'users')