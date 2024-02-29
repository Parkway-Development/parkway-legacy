const mongoose = require('mongoose');

//figure out benefits with Cathy
const payrollSchema = new mongoose.Schema({
    employeeId: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
    },
    payPeriod: {
        required: true,
        type: String,
        lowercase: true
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