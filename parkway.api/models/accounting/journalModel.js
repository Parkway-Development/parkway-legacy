const mongoose = require('mongoose');
const { validateAccountSumMatchesAmount } = require('../../helpers/validationHelper');

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

journalSchema.pre('save', async function(next) {
    const totalDebits = this.debits.reduce((total, debit) => total + debit.amount, 0);
    const totalCredits = this.credits.reduce((total, credit) => total + credit.amount, 0);

    if (totalDebits !== totalCredits) {
        next(new Error('The sum of debits must equal the sum of credits.'));
    } else {
        next();
    }
});

module.exports = mongoose.model('Journal', journalSchema, 'journalentries');
