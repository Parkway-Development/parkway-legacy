const mongoose = require('mongoose');
const Address = require('./sharedModels').addressSchema;
//const AppSettings = require('./sharedModels').appSettingsSchema;

//const Subscription = require('./sharedModels').subscriptionSchema;
const SubscriptionType = require('./constants').SubscriptionType;


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
    //address: Address,
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
    //appSettings: [AppSettings],
    //subscription: Subscription,
    allowedOrigins: [{
        type: String
    }]
});

module.exports = mongoose.model('Organization', organizationSchema, 'organizations');
