const mongoose = require('mongoose');
const { validateAccountSumMatchesAmount } = require('../helpers/validationHelper');

const journalSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    description: {
        type: String,
        default: 'New Journal'
    },
    debits: [
        {
            account: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Account',
                required: true
            },
            amount: {
                type: Number,
                required: true,
                default: 0
            }
        }
    ],
    credits: [
        {
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
    notes: [ 
        String 
    ]
    });

    contributionSchema.path('accounts').validate(function (accounts) {
        return validateAccountSumMatchesAmount(this.totalAmount, accounts);
    }, 'The sum of accounts amounts must equal the total amount.');

module.exports = mongoose.model('Journal', journalSchema, 'journalentries')