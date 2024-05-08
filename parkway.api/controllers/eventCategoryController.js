const mongoose = require('mongoose');
const EventCategory = require('../models/eventCategoryModel');

const addEventCategory = async (req, res) => {
    try {
        const eventCategory = new EventCategory(req.body);
        if (!eventCategory) { throw new Error("Event category could not be created.") }

        const validationError = eventCategory.validateSync();

        if (validationError) { throw new Error(validationError.message) }

        await eventCategory.save();
        return res.status(201).json(eventCategory);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error.message);
    }
}

const getAllEventCategories = async (req, res) => {
    try{
        const eventCategories = await EventCategory.find({}).sort({name: 'asc'});

        if (!eventCategories) { throw new Error("No event categories were returned.") }
    
        res.status(200).json(eventCategories);
    
    }catch(error){
        console.log(error)
        return res.status(500).json(error)
    }
}

const getEventCategoryById = async (req, res) => {
    try {
        const {id} = req.params;
        if (!id) { throw new Error("Please provide an event category Id.") }
        if (!mongoose.Types.ObjectId.isValid(id)) { throw new Error("Invalid ID.") }

        const eventCategory = await EventCategory.findById(id);
    
        if (!eventCategory) { throw new Error("No event category was found with that Id.") }
    
        res.status(200).json(eventCategory)
    
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

const updateEventCategory = async (req, res) => {
    try {
        const {id} = req.params;
        if(!id) { throw new Error("Please provide an event category Id.") }
        if (!mongoose.Types.ObjectId.isValid(id)) { throw new Error("Invalid ID.") }

        const updatedEventCategory = await EventCategory.findByIdAndUpdate(id, req.body, {new: true});
    
        if (!updatedEventCategory) {
            return res.status(404).json({message: "No such event category found."})
        }
        res.status(200).json(updatedEventCategory)
    
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

const deleteEventCategory = async (req, res) => {
    try {
        const {id} = req.params;
        if (!id) { throw new Error("Please provide an event category Id.") }
        if (!mongoose.Types.ObjectId.isValid(id)) { throw new Error("Invalid ID.") }
    
        const deletedEventCategory = await EventCategory.findByIdAndDelete(id);
    
        if (!deletedEventCategory) { throw new Error("No event category was found with that Id.") }

        res.status(200).json(deletedEventCategory)
    
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

module.exports = {
    addEventCategory, 
    getAllEventCategories, 
    getEventCategoryById, 
    updateEventCategory, 
    deleteEventCategory
};
