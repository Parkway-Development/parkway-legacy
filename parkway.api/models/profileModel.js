const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    firstname: {
        required: true,
        type: String,
        lowercase: true
    },
    lastname: {
        required: true,
        type: String,
        lowercase: true
    },
    middleinitial: {
        required: false,
        type: String,
        lowercase: true
    },
    nickname: {
        required: false,
        type: String,
        lowercase: true
    },
    dateofbirth: {
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
    streetaddress1: {
        required: false,
        type: String,
        lowercase: true
    },
    streetaddress2: {
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
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
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
        enum: ['active', 'inactive', 'deceased','visitor'],
        lowercase: true
    },
    applicationrole: {
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
    }
}, {timestamps: true})

module.exports = mongoose.model('Profile', profileSchema, 'profiles')