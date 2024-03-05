const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    clientName: {
        required: true,
        type: String
    },
    accountNumber: {
        required: true,
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
    businessPhone: {
        required: false,
        type: String
    },
    businessEmail: {
        required: false,
        type: String
    },
    website: {
        required: false,
        type: String
    },
    primaryContact: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    subscriptionType: {
        required: true,
        type: String,
        default: 'Beta Client'
    },
    subscriptionStartDate: {
        required: true,
        type: Date,
        default: Date.now
    },
    subscriptionEndDate: {
        required: true,
        type: Date,
        default: Date.now
    },
    subscriptionStatus: {
        required: true,
        type: String,
        default: 'Active'
    },
    subscriptionPlan: {
        required: true,
        type: String,
        default: 'Free'
    },
    depreciationType: {
        required: false,
        type: String,
        default: 'Straight Line'
    },
})


module.exports = mongoose.model('Client', clientSchema, 'clients')