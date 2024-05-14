const mongoose = require('mongoose');

const depositSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    profileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    contributions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Contribution'
        }
    ],
    donations: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Donation'
        }
    ]
});

module.exports = mongoose.model('Deposit', depositSchema);