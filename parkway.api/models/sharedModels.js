const mongoose = require('mongoose');
const { validatePostalCode } = require('../helpers/validationHelper'); // Corrected function name
const { ApprovedCountries, SubscriptionType } = require('./constants'); // Consolidated import

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
    addressLine: {
        type: String,
        required: true
    },
    addressLine2: {
        type: String
    },
    city: {
        type: String,
        required: true
    },
    subdivision: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true,
        validate: {
            validator: function (postalCode) {
                const countryCode = this.country;
                return validatePostalCode(postalCode, countryCode); // Corrected function call
            },
            message: 'Invalid postal code'
        }
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
};
