const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema({
    totalAmount: {
        required: true,
        type: Number
    },
    transactionDate: {
        required: true,
        type: Date,
        default: Date.now()
    },
    depositDate: {
        type: Date
    },
    locked: {
        type: Boolean,
        default: false
    },
    depositBatchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DepositBatch'
    },
    type: {
        required: true,
        type: String
    },
    accounts: [
        {
            _id: false,
            account: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Account',
                required: true
            },
            amount: {
                type: Number,
                required: true,
                validate: {
                    validator: function(v) {
                        return v > 0;
                    },
                    message: props => `${props.value} is not a valid amount.`
                }
            }
        }
    ],
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    }
}, {timestamps: true})

contributionSchema.path('accounts').validate(function (accounts) {
    const totalAmount = this.totalAmount;
    const sumOfAccounts = accounts.reduce((sum, record) => sum + record.amount, 0);
    return totalAmount === sumOfAccounts;
},
'The sum of accounts amounts must equal the total amount.');

module.exports = mongoose.model('Contribution', contributionSchema,'contributions');