const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    notes: [ 
        String 
    ]
    });