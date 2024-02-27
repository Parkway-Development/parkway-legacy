const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    firstname: {
        required: true,
        type: String
    },
    lastname: {
        required: true,
        type: String
    },
    middleinitial: {
        required: false,
        type: String
    },
    dateofbirth: {
        required: false,
        type: Date
    },
    gender: {
        required: false,
        type: String,
        enum: ['male','female']
    },
    email: {
        required: false,
        type: String
    },
    mobile: {
        required: false,
        type: String
    },
    streetaddress1: {
        required: false,
        type: String
    },
    streetaddress2: {
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
        enum: ['active', 'inactive', 'deceased','visitor']
    },
    applicationrole: {
        type: String,
        required: true,
        default: 'none',
        enum: ['super','owner','admin', 'lead', 'contributor', 'viewer','none']
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