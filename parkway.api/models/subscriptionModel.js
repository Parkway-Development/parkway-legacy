const mongoose = require('mongoose');
const { SubscriptionType } = require('./constants');

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    renewalInterval: {
        enum: Object.values(RenewalInterval),
        required: true,
        default: RenewalInterval.MONTHLY
    },
    type:{
        enum: Object.values(SubscriptionType),
        required: true,
        default: SubscriptionType.FREE
    }
}, {timestamps: true})

module.exports = mongoose.model('Subscription', subscriptionSchema, 'platform')