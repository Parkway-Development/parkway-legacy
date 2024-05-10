const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: 'New Account'
    },
    type: {
        type: String,
        required: true,
        default: 'Undefined'
    },
    subtype:{
        type: String,
        required: true,
        default: 'Undefined'
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    children: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Account'
    },
    custodian: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
    },
    notes: [ 
        String 
    ]
    });

module.exports = mongoose.model('Account', accountSchema, 'accounts')