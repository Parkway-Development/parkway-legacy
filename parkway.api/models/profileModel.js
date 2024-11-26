const mongoose = require('mongoose');
const { Address } = require('./sharedModels').addressSchema;

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    organizationId: {
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
//    address: Address,
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
    }
}, {timestamps: true})

module.exports = mongoose.model('Profile', profileSchema, 'profiles')