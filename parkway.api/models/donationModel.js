const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    amount: {
        required: true,
        type: Number
    },
    date: {
        required: true,
        type: Date
    },
    donationType: {
        required: true,
        type: String
    },
    fund: {
        required: true,
        type: String,
        default: 'Unassigned'
    },
    profile: {
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    }
}, {timestamps: true})

module.exports = mongoose.model('Donation', donationSchema,'donations');