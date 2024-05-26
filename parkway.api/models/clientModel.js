const mongoose = require('mongoose');

const appSettingsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    }
});

const clientSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: true
    },
    accountNumber: {
        type: String,
        required: true
    },
    streetAddress1: {
        type: String
    },
    streetAddress2: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    zip: {
        type: String
    },
    businessPhone: {
        type: String
    },
    businessEmail: {
        type: String
    },
    website: {
        type: String
    },
    primaryContact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    appSettings: [appSettingsSchema]
});

module.exports = mongoose.model('Client', clientSchema, 'clients');
