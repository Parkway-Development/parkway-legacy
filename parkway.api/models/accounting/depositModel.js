const mongoose = require('mongoose');

const depositSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    processedDate: {
        type: Date,
    },
    creatorProfileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    approverProfileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
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
}, {
    timestamps: true
});

module.exports = mongoose.model('Deposit', depositSchema);
