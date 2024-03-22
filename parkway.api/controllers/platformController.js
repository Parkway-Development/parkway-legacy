const mongoose = require('mongoose')
const Enum = require('../models/enumModel')
const EventCategory = require("../models/eventCategoryModel");

//Get all enums
const getEnums = async (req, res) => {
    const enums = await Enum.find({})
    if(!enums){
        return res.status(404).json({message: "No enums were returned."})
    }
    res.status(200).json(enums)
}

//Get enum by name
const getEnumByName = async (req, res) => {
    try {
        const { name } = req.params;
        const enums = await Enum.findOne({name: name})
        return res.status(200).json(enums)
    }catch(error){
        return res.status(404).json({message: "No such enum found."})
    }
}

//Get enum by ID
const getEnumById = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such enum.'})
    }
    const enumValue = await Enum.findById(id);

    if (!enumValue) {
        return res.status(404).json({message: "No such enum found."})
    }

    res.status(200).json(enumValue)
}

//Add enum
const addEnum = async (req, res) => {
    try {
        const enumItem = new Enum(req.body);
        await enumItem.save();
        return res.status(201).json(enumItem);
    }
    catch(error){
        return res.status(400).json({error: error.message})
    }
}

//Update enum
const updateEnumByName = async (req, res) => {
    try {
        const { name } = req.params;
        const updatedEnum = await Enum.findOneAndUpdate({name: name}, req.body, {new: true})
        return res.status(200).json(updatedEnum)
    }catch(error){
        return res.status(404).json({message: "No such enum found."})
    }
}

//Update event category by ID
const updateEnumById = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such enum.'})
    }
    const updatedEnum = await Enum.findByIdAndUpdate(id, req.body, {new: true});

    if (!updatedEnum) {
        return res.status(404).json({message: "No such enum found."})
    }
    res.status(200).json(updatedEnum)
}

//Delete enum
const deleteEnumByName = async (req, res) => {
    try {
        const { name } = req.params;
        await Enum.findOneAndDelete({name: name})
        return res.status(200).json({message: "Enum deleted."})
    }catch(error){
        return res.status(404).json({message: "No such enum found."})
    }
}

//Delete enum by ID
const deleteEnumById = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such enum.'})
    }

    const deletedEnum = await Enum.findByIdAndDelete(id);

    if (!deletedEnum) {
        return res.status(404).json({message: "No such enum found."})
    }
    res.status(200).json(deletedEnum)
}

module.exports = { 
    getEnums,
    getEnumById,
    getEnumByName,
    addEnum,
    updateEnumById,
    updateEnumByName,
    deleteEnumById,
    deleteEnumByName
}