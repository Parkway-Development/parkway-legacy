const mongoose = require('mongoose')
const Enum = require('../models/enumModel')

//Get all enums
exports.getEnums = async (req, res) => {
    const enums = await Enum.find({})
    if(!enums){
        return res.status(404).json({message: "No enums were returned."})
    }
    res.status(200).json(enums)
}

//Get enum by name
exports.getEnumByName = async (req, res) => {
    try {
        const { name } = req.params;
        const enums = await Enum.findOne({name: name})
        return res.status(200).json(enums)
    }catch(error){
        return res.status(404).json({message: "No such enum found."})
    }
}

//Add enum
exports.addEnum = async (req, res) => {
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
exports.updateEnum = async (req, res) => {
    try {
        const { name } = req.params;
        const updatedEnum = await Enum.findOneAndUpdate({name: name}, req.body, {new: true})
        return res.status(200).json(updatedEnum)
    }catch(error){
        return res.status(404).json({message: "No such enum found."})
    }
}

//Delete enum
exports.deleteEnum = async (req, res) => {
    try {
        const { name } = req.params;
        await Enum.findOneAndDelete({name: name})
        return res.status(200).json({message: "Enum deleted."})
    }catch(error){
        return res.status(404).json({message: "No such enum found."})
    }
}

module.exports = { 
    addProfile, 
    getAll, 
    getById, 
    getByLastName, 
    getByMobileNumber,
    getByHomeNumber, 
    updateProfile, 
    deleteProfile,
    connectUserAndProfile 
}