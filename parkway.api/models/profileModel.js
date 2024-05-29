const mongoose = require('mongoose');
const { addressSchema } = require('./sharedModels');

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    currentOrganizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    firstName: {
        required: true,
        type: String
    },
    lastName: {
        required: true,
        type: String
    },
    middleInitial: {
        type: String
    },
    nickname: {
        type: String
    },
    dateOfBirth: {
        type: Date
    },
    gender: {
        type: String
    },
    email: {
        type: String
    },
    mobilePhone: {
        type: String
    },
    homePhone: {
        type: String
    },
    address:{
        type: addressSchema
    },
    member:{
        required: true,
        default: false,
        type: Boolean
    },
    teams: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: false
    }],
    family: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Family',
        required: false
    },
    preferences: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Preferences',
        required: false
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

module.exports = mongoose.model('Profile', profileSchema, 'profiles')