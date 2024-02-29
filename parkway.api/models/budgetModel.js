const mongoose = require('mongoose');

const budgetModel = new mongoose.Schema({
    budgetYear: {
        type: Number,
        required: true
    },
    fundId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    plannedIncome: {
        type: Number,
        required: true
    },
    plannedExpenses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expense',
    }],
    actualIncome: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donation',
        required: false
    }],
    actualExpenses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expense',
        required: false
    }],
    notes: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model('Budget', budgetModel, 'budgets')