const mongoose = require('mongoose');
const { addressSchema, appSettingsSchema, subscriptionSchema } = require('./sharedModels');
const {SubscriptionType} = require('./constants');


const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    accountNumber: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: addressSchema,
        required: true
    },
    phone: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Please fill a valid phone number with 10 digits']
    },
    email: {
        type: String,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    website: {
        type: String,
        match: [/^https?:\/\/.+/, 'Please fill a valid website URL']
    },
    primaryContactId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    appSettings: {
        type: [appSettingsSchema],
        default: []
    },
    subscription: {
        type: subscriptionSchema,
        required: true,
        default: {subscriptionType: SubscriptionType.TRIAL}
    },
    allowedOrigins: [{
        type: String
    }]
});

module.exports = mongoose.model('Organization', organizationSchema, 'organizations');
