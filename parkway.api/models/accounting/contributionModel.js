const mongoose = require('mongoose');
const { validateAccountSumMatchesAmount } = require('../../helpers/validationHelper');
const { MonetaryInstrument } = require('../constants');

const contributionSchema = new mongoose.Schema({
    contributorProfileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    gross: {
        required: true,
        type: Number
    },
    fees: {
        required: true,
        type: Number
    },
    net: {
        required: true,
        type: Number
    },
    accounts: [
        {
            _id: false,
            accountId: {
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
    transactionDate: {
        required: true,
        type: Date,
        default: Date.now
    },
    depositId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Deposits'
    },
    processedDate: {
        type: Date
    },
    type: {
        required: true,
        type: String,
        enum: Object.values(MonetaryInstrument),
        default: 'cash'
    },
    notes: [{
        type: String
    }]

}, {timestamps: true});

contributionSchema.path('accounts').validate(function (accounts) {
    return validateAccountSumMatchesAmount(this.net, accounts);
}, 'The sum of accounts amounts must equal the total amount.');

module.exports = mongoose.model('Contribution', contributionSchema, 'contributions');
