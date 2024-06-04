const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    description: {
        required: true,
        type: String
    },
    value: {
        type: Number,
        default: 0
    },
    donorProfileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    accounts: [
        {
            _id: false,
            accountId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Account',
            },
            amount: {
                type: Number,
                validate: {
                    validator: function(v) {
                        return v > 0;
                    },
                    message: props => `${props.value} is not a valid amount.`
                }
            }
        }
    ],
    notes:[{
        type: String
    }]
}, {timestamps: true})

module.exports = mongoose.model('Donation', donationSchema,'donations');