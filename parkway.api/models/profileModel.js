const mongoose = require('mongoose');
const { addressSchema } = require('./sharedModels');

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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
    clients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clients',
        required: true
    }],
}, {timestamps: true})

module.exports = mongoose.model('Profile', profileSchema, 'profiles')