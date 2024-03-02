const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    firstName: {
        required: true,
        type: String,
        lowercase: true
    },
    lastName: {
        required: true,
        type: String,
        lowercase: true
    },
    middleInitial: {
        required: false,
        type: String,
        lowercase: true
    },
    nickname: {
        required: false,
        type: String,
        lowercase: true
    },
    dateOfBirth: {
        required: false,
        type: Date
    },
    gender: {
        required: false,
        type: String,
        enum: ['male','female'],
        lowercase: true
    },
    email: {
        required: false,
        type: String,
        lowercase: true
    },
    mobile: {
        required: false,
        type: String
    },
    streetAddress1: {
        required: false,
        type: String,
        lowercase: true
    },
    streetAddress2: {
        required: false,
        type: String,
        lowercase: true
    },
    city: {
        required: false,
        type: String,
        lowercase: true
    },
    state: {
        required: false,
        type: String,
        lowercase: true
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
    status:{
        type: String,
        required: true,
        default: 'active',
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