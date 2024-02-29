//setup Mongoose
const mongoose = require('mongoose');
//import the necessary models
const Liability = require('../models/liabilityModel');

const addLiability = async (req, res) => {
    try {
        const liability = new Liability(req.body);
        await liability.save();
        res.status(201).send(liability);
    } catch (error) {
        res.status(400).send(error);
    }
}

//Get all liabilities
const getAllLiabilities = async (req, res) => {
    try {
        const liabilities = await Liability.find({});
        res.status(200).send(liabilities);
    } catch (error) {
        res.status(400).send(error);
    }
}

//Get liability by ID
const getLiabilityById = async (req, res) => {
    try {
        const liability = await Liability.findById(req.params.id);
        res.status(200).send(liability);
    } catch (error) {
        res.status(400).send(error);
    }
}

//Get liabilities by fund
const getLiabilitiesByFund = async (req, res) => {
    try {
        const liabilities = await Liability.find({ fund: req.params.id });
        res.status(200).send(liabilities);
    } catch (error) {
        res.status(400).send(error);
    }
}

//Get liabilities by category
const getLiabilitiesByCategory = async (req, res) => {
    try {
        const liabilities = await Liability.find({ category: req.params.category });
        res.status(200).send(liabilities);
    } catch (error) {
        res.status(400).send(error);
    }
}

//Update a liability by ID
const updateLiability = async (req, res) => {
    try {
        await Liability.findByIdAndUpdate
            (req.params.id, req.body
                , { new: true, runValidators: true }
            );
        res.status(200).send('Liability updated');
    }
    catch (error) {
        res.status(400).send(error);
    }
}

//Delete a liability by ID
const deleteLiability = async (req, res) => {
    try {
        await Liability.findByIdAndDelete(req.params.id);
        res.status(200).send('Liability deleted');
    } catch (error) {
        res.status(400).send(error);
    }
}

module.exports = {
    addLiability,
    getAllLiabilities,
    getLiabilityById,
    getLiabilitiesByFund,
    getLiabilitiesByCategory,
    updateLiability,
    deleteLiability
}