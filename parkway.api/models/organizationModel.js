const mongoose = require('mongoose');
const { appSettingsSchema, subscriptionSchema } = require('./sharedModels');
const { addressSchema } = require('./addressModel');
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
    address:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
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
