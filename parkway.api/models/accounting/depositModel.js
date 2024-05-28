const mongoose = require('mongoose');
const {DepositStatus} = require('../constants');


const depositHistorySchema = new mongoose.Schema({
    status: {
        type: String,
        enum: Object.values(DepositStatus)
    },
    date: {
        type: Date,
        required: true
    },
    responsiblePartyProfileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    _id: false
});

const depositSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    currentStatus: {
        type: String,
        enum: Object.values(DepositStatus),
        default: DepositStatus.UNDEPOSITED
    },
    statusDate: {
        type: Date,
        required: true
    },
    history: [
        depositHistorySchema
    ],
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
