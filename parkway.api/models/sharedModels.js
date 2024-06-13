const mongoose = require('mongoose');
const { ApprovedCountries } = require('./constants');
const { SubscriptionType } = require('./constants');

const appSettingsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    _id: false
});

const addressSchema = new mongoose.Schema({
    streetAddress1: {
        type: String,
        required: true
    },
    streetAddress2: {
        type: String
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true,
        match: [/^\d{5}(-\d{4})?$/, 'Please fill a valid zip code']
    },
    country: {
        type: String,
        enum: Object.values(ApprovedCountries),
        default: ApprovedCountries.US,
        required: true
    },
    _id: false
});

const subscriptionSchema = new mongoose.Schema({
    subscriptionType: {
        type: String,
        enum: Object.values(SubscriptionType),
        required: true
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true
    }
});

module.exports = {
    appSettingsSchema,
    addressSchema,
    subscriptionSchema
}