const mongoose = require('mongoose');

const fundSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: false,
        default: 'New Fund'
    },
    targetAmount: {
        type: Number,
        required: true,
        default: 0
    },
    currentAmount: {
        type: Number,
        required: true,
        default: 0
    },
    notes: {
        type: String,
        required: false
    }
    });

module.exports = mongoose.model('Fund', fundSchema, 'funds')