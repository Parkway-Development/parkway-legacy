const mongoose = require('mongoose');
const { AccountType, AccountRestriction } = require('../constants');

const accountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: 'New Account'
    },
    balance: {
        type: Number,
        required: true,
        default: 0
    },
    type: {
        type: String,
        enum: Object.values(AccountType),
        default: AccountType.UNKNOWN
    },
    restriction:{
        type: String,
        enum: Object.values(AccountRestriction),
        default: AccountRestriction.UNRESTRICTED
    },
    sibling: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Account'
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    children: [{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Account'
        }
    ],
    custodian: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
    },
    notes: [ 
        String 
    ]
    });

    accountSchema.index({ name: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Account', accountSchema, 'accounts')