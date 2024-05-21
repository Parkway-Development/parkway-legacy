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
    siblingId: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Account'
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    childIds: [{
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

module.exports = mongoose.model('Account', accountSchema, 'accounts')