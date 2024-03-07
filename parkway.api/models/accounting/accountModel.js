const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: 'New Account'
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
    notes: [ 
        String 
    ]
    });

module.exports = mongoose.model('Account', accountSchema, 'accounts')