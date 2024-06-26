const mongoose = require('mongoose');
const { MonetaryInstrument, AccountTransactionType } = require('../constants');

const expenseSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    payableToProfileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    memo: {
        type: String
    },
    monetaryInstrument: {
        type: String,
        enum: Object.values(MonetaryInstrument),
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    responsiblePartyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    notes: [ 
        {
            type: String,
            default: []
        }
    ]
}, { timestamps: true });

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
