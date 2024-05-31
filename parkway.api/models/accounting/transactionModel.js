const mongoose = require('mongoose');
const { TransactionType } = require('../constants');
const { AccountTransactionType } = require('../constants');

const accountDetailSchema = new mongoose.Schema({
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    type: {
        type: String,
        enum: Object.values(AccountTransactionType),
        required: true
    }
});

const transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: Object.values(TransactionType),
        required: true
    },
    destinationAccount: {
        type: [accountDetailSchema],
        required: true
    },
    sourceAccount: {
        type: [accountDetailSchema],
        required: true
    },
    responsiblePartyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    notes: [ 
        {
            type: String,
            default: []
        }
    ]
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
