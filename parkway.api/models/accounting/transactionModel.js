const mongoose = require('mongoose');

const accountDetailSchema = new mongoose.Schema({
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    type: {
        type: String,  // 'debit' or 'credit'
        required: true
    }
});

const transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String, // 'transfer', 'deposit', 'withdrawal', 'adjustment', 'reversal'
        required: true
    },
    toAccount: [accountDetailSchema],
    fromAccount: [accountDetailSchema],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    notes: [ 
        {
            type: String
        }
    ]
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
