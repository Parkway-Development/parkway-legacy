const mongoose = require('mongoose');
const EventCategory = require('../models/eventCategoryModel');

//Post an event category
const addEventCategory = async (req, res) => {
    const eventCategory = new EventCategory(req.body);

    const validationError = eventCategory.validateSync();

    if (validationError) {
        return res.status(400).json({message: validationError.message});
    }

    try {
        await eventCategory.save();
        return res.status(201).json(eventCategory);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error.message);
    }
}

//Get all event categories
const getAll = async (req, res) => {
    const eventCategories = await EventCategory.find({}).sort({name: 'asc'});

    if (!eventCategories) {
        return res.status(404).json({message: "No event categories were returned."})
    }

    res.status(200).json(eventCategories);
}

//Get event category by ID
const getById = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such event category.'})
    }
    const eventCategory = await EventCategory.findById(id);

    if (!eventCategory) {
        return res.status(404).json({message: "No such event category found."})
    }

    res.status(200).json(eventCategory)
}

//Update event category by ID
const updateEventCategory = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such event category.'})
    }
    const updatedEventCategory = await EventCategory.findByIdAndUpdate(id, req.body, {new: true});

    if (!updatedEventCategory) {
        return res.status(404).json({message: "No such event category found."})
    }
    res.status(200).json(updatedEventCategory)
}

//Delete event category by ID
const deleteEventCategory = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such event category.'})
    }

    const deletedEventCategory = await EventCategory.findByIdAndDelete(id);

    if (!deletedEventCategory) {
        return res.status(404).json({message: "No such event category found."})
    }
    res.status(200).json(deletedEventCategory)
}

module.exports = {
    addEventCategory, getAll, getById, updateEventCategory, deleteEventCategory
};
