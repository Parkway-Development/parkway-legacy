const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    description: {
        required: true,
        type: String,
        lowercase: true
    },
    amount: {
        required: true,
        type: Number
    },
    date: {
        required: true,
        type: Date
    },
    category: {
        required: false,
        type: String,
        lowercase: true
    },
    fund: {
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    notes: {
        required: false,
        type: String,
        lowercase: true
    }
})

module.exports = mongoose.model('Expense', expenseSchema, 'expenses')