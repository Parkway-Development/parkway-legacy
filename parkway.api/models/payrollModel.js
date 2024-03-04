const mongoose = require('mongoose');

//figure out benefits with Cathy
const payrollSchema = new mongoose.Schema({
    profile: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    payPeriod: {
        required: true,
        type: Number
    },
    payDate: {
        required: true,
        type: Date
    },
    hours: {
        required: true,
        type: Number
    },
    rate: {
        required: true,
        type: Number
    },
    gross: {
        required: true,
        type: Number
    },
    taxes: {
        required: true,
        type: Number
    },
    net: {
        required: true,
        type: Number
    }
})

module.exports = mongoose.model('Payroll', payrollSchema, 'payroll')