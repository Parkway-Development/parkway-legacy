const mongoose = require('mongoose');

const liabilitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    amount: {
        type: Number,
        required: true
    },
    maturityDate: {
        type: Date,
        required: false
    },
    fund: {
        type: mongoose.Schema.ObjectId,
        ref: 'Fund',
        required: false
    },
    category: {
        type: String,
        required: false
    }
})
module.exports = mongoose.model('Liability', liabilitySchema, 'liabilities')