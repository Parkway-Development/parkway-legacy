//setup Mongoose
const mongoose = require('mongoose');
//import the necessary models
const Expense = require('../models/expenseModel');

//Post an expense
const addExpense = async (req, res) => {
    const expense = new Expense({
        amount: req.body.amount,
        date: req.body.date,
        type: req.body.type,
        vendorId: req.body.vendorId
    })

    const expenseToSave = await expense.save();

    if(!expenseToSave){
    return res.status(404).json({mssg: "The save failed."})}

    res.status(200).json(expenseToSave)
}

//Get all expenses
const getAllExpenses = async (req, res) => {
    const expenses = await Expense.find({}).sort({date: -1});
    if(!expenses){
        return res.status(404).json({mssg: "No expenses were returned."})
    }
    res.status(200).json(expenses)
}

//Get expense by ID
const getExpenseById = async (req, res) => {

    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such expense.'})
    }
    const expense = await Expense.findById(id);

    if(!expense){
        return res.status(404).json({mssg: "No such expense found."})
    }
        
    res.status(200).json(expense)
}

//Get expenses by vendor
const getExpensesByVendor = async (req, res) => {
    const expenses = await Expense.find({vendorId: req.params.id}).sort({date: -1});
    if(!expenses){
        return res.status(404).json({mssg: "No expenses found."})
    }
    res.status(200).json(expenses)
}

//Get expenses by fund
const getExpensesByFund = async (req, res) => {
    const expenses = await Expense.find({fund: req.params.fund}).sort({date: -1});
    if(!expenses){
        return res.status(404).json({mssg: "No expenses found."})
    }
    res.status(200).json(expenses)
}

//Update an expense by ID
const updateExpense = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such expense.'})
    }

    const expense = await Expense.findById(id);

    if(!expense){
        return res.status(404).json({mssg: "No such expense found."})
    }

    const updatedExpense = await Expense.findByIdAndUpdate(id, req.body, {new: true});

    if(!updatedExpense){
        return res.status(404).json({mssg: "The update failed."})
    }
    res.status(200).json(updatedExpense)
}

//Delete an expense by ID
const deleteExpense = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such expense.'})
    }

    const expense = await Expense.findById(id);

    if(!expense){
        return res.status(404).json({mssg: "No such expense found."})
    }

    const deletedExpense = await Expense.findByIdAndDelete(id);

    if(!deletedExpense){
        return res.status(404).json({mssg: "The delete failed."})
    }
    res.status(200).json(deletedExpense)
}

module.exports = {
    addExpense,
    getAllExpenses,
    getExpenseById,
    getExpensesByVendor,
    getExpensesByFund,
    updateExpense,
    deleteExpense
}