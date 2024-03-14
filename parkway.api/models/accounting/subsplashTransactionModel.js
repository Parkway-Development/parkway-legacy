const mongoose = require('mongoose');

const subsplashTransactionSchema = new mongoose.Schema({

    transaction_id: {
        type: Number,
        required: true,
        default: 0
    },
    transaction_date: {
        type: Date,
        required: true,
        default: Date.now
    },
    transfer_id: {
        type: Number,
        required: true,
        default: 0
    },
    transfer_date:{
        type: Date,
        required: true,
        default: Date.now
    },
    transfer_amount: {
        type: Number,
        required: true,
        default: 0
    },
    donor_id: {
        type: Number,
        required: true,
        default: 0
    },
    member_id: {
        type: Number
    },
    donor_first_name:{
        type: String,
        required: true
    },
    donor_last_name:{
        type: String,
        required: true
    },
    donor_email:{
        type: String,
        required: true,
    },
    gross_amount:{
        type: Number,
        required: true,
        default: 0
    },
    net_amount: {
        type: Number,
        required: true,
        default: 0
    },
    fee_amount:{
        type: Number,
        required: true,
        default: 0
    },
    covered_fee:{
        type: Boolean,
        required: true,
        default: false
    },
    fund:{
        type: String,
        required: true
    },
    fund_id:{
        type: Number,
        required: true,
        default: 0
    },
    cause: {
        type: String
    },
    cause_id:{
        type: Number
    },
    type:{
        type: String,
        required: true
    },
    campus:{
        type: String
    },
    donor_memo:{
        type: String
    },
});

module.exports = mongoose.model('SubSplashTransaction', subsplashTransactionSchema, 'subsplashtransactions')