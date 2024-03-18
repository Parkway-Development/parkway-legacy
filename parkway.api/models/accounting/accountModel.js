const mongoose = require('mongoose');


// test to track changes in git repo

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
    custodian: {
        type: mongoose.Schema.Types.ObjectId,
        default: 'profile'
    },
    notes: [ 
        String 
    ]
    });

module.exports = mongoose.model('Account', accountSchema, 'accounts')