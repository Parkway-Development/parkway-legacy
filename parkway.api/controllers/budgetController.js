//setup Mongoose
const mongoose = require('mongoose');
//import the necessary models
const Budget = require('../models/budgetModel');

//Post a budget
const addBudget = async (req, res) => {
    try {
        const budget = new Budget(req.body);
        await budget.save();
        res.status(201).send(budget);
    } catch (error) {
        res.status(400).send(error);
    }
}

//Get all budgets
const getAllBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({});
        res.status(200).send(budgets);
    } catch (error) {
        res.status(400).send(error);
    }
}

//Get budget by ID
const getBudgetById = async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id);
        res.status(200).send(budget);
    } catch (error) {
        res.status(400).send(error);
    }
}

//Get budgets by fund
const getBudgetsByFund = async (req, res) => {
    try {
        const budgets = await Budget.find({ fundId: req.params.id });
        res.status(200).send(budgets);
    } catch (error) {
        res.status(400).send(error);
    }
}

//Get budget by year
const getBudgetsByYear = async (req, res) => {
    try {
        const budgets = await Budget.find({ budgetYear: req.params.year });
        res.status(200).send(budgets);
    } catch (error) {
        res.status(400).send(error);
    }
}

//Update a budget by ID
const updateBudget = async (req, res) => {
    try {
        await Budget.findByIdAndUpdate
            (req.params.id, req.body
                , { new: true, runValidators: true }
            );
        res.status(200).send('Budget updated');
    }
    catch (error) {
        res.status(400).send(error);
    }
}   

//Delete a budget by ID
const deleteBudget = async (req, res) => {
    try {
        await Budget.findByIdAndDelete(req.params.id);
        res.status(200).send('Budget deleted');
    } catch (error) {
        res.status(400).send(error);
    }
}

module.exports = {
    addBudget,
    getAllBudgets,
    getBudgetById,
    getBudgetsByFund,
    getBudgetsByYear,
    updateBudget,
    deleteBudget
}