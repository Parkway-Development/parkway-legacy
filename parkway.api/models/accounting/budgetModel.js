const mongoose = require('mongoose');

const budgetModel = new mongoose.Schema({
    budgetYear: {
        type: Number,
        required: true
    },
    fund: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fund',
        required: true
    },
    budgetedIncome: [{
        incomeSource: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        }
    }],
    plannedExpenses: [{
        expenseReason: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        }
    }],
    actualIncome: [{
        incomeRecord:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Donation',
            required: false
        },
        amount: {
            type: Number,
            required: false
        }
    }],
    actualExpenses: [{
        expenseRecord:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Expense',
            required: false
        },
        amount: {
            type: Number,
            required: false
        }
    }],
    notes: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model('Budget', budgetModel, 'budgets')