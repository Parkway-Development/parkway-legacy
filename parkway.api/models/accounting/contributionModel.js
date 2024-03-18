const mongoose = require('mongoose');
const { validateAccountSumMatchesAmount } = require('../../helpers/validationHelper');

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
    approvalDate: {
        type: Date
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    locked: {
        type: Boolean,
        required: true,
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
    return validateAccountSumMatchesAmount(this.totalAmount, accounts);
}, 'The sum of accounts amounts must equal the total amount.');

module.exports = mongoose.model('Contribution', contributionSchema,'contributions');