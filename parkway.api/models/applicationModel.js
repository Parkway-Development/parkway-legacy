const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    currentSecret: {
        type: String,
        required: true,
        unique: true
    },
    previousSecrets: [{
        type: String
    }],
    isExternal: {
        type: Boolean,
        default: true
    },
    currentKey: {
        type: String
    },
    queryRateLimit: {
        type: Number,
        default: 1000,
    },
    queryRateInterval: {
        type: String,
        enum: ['minute', 'hour', 'day', 'unlimited'],
        default: 'day'
    },
    keyExpiration: {
        type: Date,
        default: Date.now
    },
    previousKeys: [{
        type: String
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },

});

module.exports = mongoose.model('Application', applicationSchema, 'applications');