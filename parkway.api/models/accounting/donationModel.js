const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    description: {
        required: true,
        type: String
    },
    amount: {
        type: Number
    },
    transactionDate: {
        required: true,
        type: Date,
        default: Date.now()
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    }
}, {timestamps: true})

module.exports = mongoose.model('Donation', donationSchema,'donations');