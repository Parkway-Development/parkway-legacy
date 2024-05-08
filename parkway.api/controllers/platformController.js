const mongoose = require('mongoose')
const Enum = require('../models/enumModel')

const getEnums = async (req, res) => {
    try {
        const enums = await Enum.find({})
        if(!enums){ throw new Error("No enums were returned.")}

        res.status(200).json(enums)    
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

const getEnumByName = async (req, res) => {
    try {
        const { name } = req.params;
        if (!name) { throw new Error("Please provide an enum name.")}

        const enums = await Enum.findOne({name: name})
        if(!enums){ throw new Error("No enums were returned.")}

        return res.status(200).json(enums)
    }catch(error){
        console.log(error)
        return res.status(500).json(error)
    }
}

const getEnumById = async (req, res) => {
    try {
        const {id} = req.params;
        if (!id) { throw new Error("Please provide an enum ID.")}
        if (!mongoose.Types.ObjectId.isValid(id)) { throw new Error("Invalid ID.")}

        const enumValue = await Enum.findById(id);
    
        if (!enumValue) { throw new Error("No enum was found with that Id.") }
    
        res.status(200).json(enumValue)
    
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

const addEnum = async (req, res) => {
    try {
        const enumItem = new Enum(req.body);
        if (!enumItem) { throw new Error("Please provide an enum.") }
        
        await enumItem.save();
        return res.status(201).json(enumItem);
    }
    catch(error){
        console.log(error)
        return res.status(500).json(error)
    }
}

const updateEnumByName = async (req, res) => {
    try {
        const { name } = req.params;
        if (!name) { throw new Error("Please provide an enum name.")}

        const updatedEnum = await Enum.findOneAndUpdate({name: name}, req.body, {new: true})
        if(!updatedEnum){ throw new Error("No enums were returned.")}

        return res.status(200).json(updatedEnum)
    }catch(error){
        console.log(error)
        return res.status(500).json(error)
    }
}

const updateEnumById = async (req, res) => {
    try {
        const {id} = req.params;
        if (!id) { throw new Error("Please provide an enum ID.")}
        if (!mongoose.Types.ObjectId.isValid(id)) { throw new Error("Invalid ID.")}
    
        const updatedEnum = await Enum.findByIdAndUpdate(id, req.body, {new: true});
    
        if (!updatedEnum) { throw new Error("No such enum found.") }
    
        res.status(200).json(updatedEnum)
    
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

const deleteEnumByName = async (req, res) => {
    try {
        const { name } = req.params;
        if (!name) { throw new Error("Please provide an enum name.")}

        const e = await Enum.findOneAndDelete({name: name})
        if(!e){ throw new Error("No enums were returned.")}

        return res.status(200).json({message: "Enum deleted."})
    }catch(error){
        console.log(error)
        return res.status(500).json(error)
    }
}

//Delete enum by ID
const deleteEnumById = async (req, res) => {
    try {
        const {id} = req.params;
        if (!id) { throw new Error("Please provide an enum ID.")}
        if (!mongoose.Types.ObjectId.isValid(id)) { throw new Error("Invalid ID.")}
    
        const deletedEnum = await Enum.findByIdAndDelete(id);
    
        if (!deletedEnum) { throw new Error("No such enum found.") }
    
        res.status(200).json(deletedEnum)
    
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
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