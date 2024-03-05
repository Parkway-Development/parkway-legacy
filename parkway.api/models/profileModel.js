const mongoose = require('mongoose');

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
        required: false,
        type: String
    },
    nickname: {
        required: false,
        type: String
    },
    dateOfBirth: {
        required: false,
        type: Date
    },
    gender: {
        required: false,
        type: String
    },
    email: {
        required: false,
        type: String
    },
    mobilePhone: {
        required: false,
        type: String
    },
    homePhone: {
        required: false,
        type: String
    },
    streetAddress1: {
        required: false,
        type: String
    },
    streetAddress2: {
        required: false,
        type: String
    },
    city: {
        required: false,
        type: String
    },
    state: {
        required: false,
        type: String
    },
    zip: {
        required: false,
        type: String
    },
    member:{
        required: true,
        default: false,
        type: Boolean
    },
    memberStatus:{
        type: String,
        required: false,
        enum: ['active','inactive','deceased','visitor','child','guest'],
        lowercase: true
    },
    applicationRole: {
        type: String,
        required: true,
        default: 'none',
        enum: ['super','owner','admin', 'lead', 'contributor', 'viewer','none'],
        lowercase: true
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
    permissions: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permissions',
        required: false
    },
    preferences: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Preferences',
        required: false
    },
}, {timestamps: true})

module.exports = mongoose.model('Profile', profileSchema, 'profiles')