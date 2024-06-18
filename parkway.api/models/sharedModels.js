const mongoose = require('mongoose');
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
    subscriptionSchema
}