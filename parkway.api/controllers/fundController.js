//setup Mongoose
const mongoose = require('mongoose');
//import the necessary models
const Fund = require('../models/fundModel');


//Post a fund
const addFund = async (req, res) => {
    try {
        const fund = new Fund(req.body);
        await fund.save();
        res.status(201).send(fund);
    } catch (error) {
        res.status(400).send(error);
    }
}

//Get all funds
const getAllFunds = async (req, res) => {
    try {
        const funds = await Fund.find({});
        res.status(200).send(funds);
    } catch (error) {
        res.status(400).send(error);
    }
}

//Get fund by ID
const getFundById = async (req, res) => {
    try {
        const fund = await Fund.findById(req.params.id);
        res.status(200).send(fund);
    } catch (error) {
        res.status(400).send(error);
    }
}

//Get a fund by name
const getFundsByName = async (req, res) => {
    try {
        const funds = await Fund.find({ name: req.params.name });
        res.status(200).send(funds);
    } catch (error) {
        res.status(400).send(error);
    }
}

//Update a fund by ID
const updateFund = async (req, res) => {
    try {
        await Fund.findByIdAndUpdate
            (req.params.id, req.body
                , { new: true, runValidators: true }
            );
        res.status(200).send('Fund updated');
    }
    catch (error) {
        res.status(400).send(error);
    }
}

//Delete a fund by ID
const deleteFund = async (req, res) => {
    try {
        await Fund.findByIdAndDelete(req.params.id);
        res.status(200).send('Fund deleted');
    } catch (error) {
        res.status(400).send(error);
    }
}

module.exports = {
    addFund,
    getAllFunds,
    getFundById,
    getFundsByName,
    updateFund,
    deleteFund
}