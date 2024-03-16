const mongoose = require('mongoose');
const Event = require('../models/eventModel');

//Post an event
const addEvent = async (req, res) => {
    const event = new Event(req.body);

    const validationError = event.validateSync();

    if (validationError) {
        return res.status(400).json({message: validationError.message});
    }

    try {
        await event.save();
        return res.status(201).json(event);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error.message);
    }
}

//Get all events
const getAll = async (req, res) => {
    const events = await Event.find({}).sort({start: 1});

    if (!events) {
        return res.status(404).json({message: "No events were returned."})
    }

    res.status(200).json(events);
}

//Get event by ID
const getById = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such event.'})
    }
    const event = await Event.findById(id);

    if (!event) {
        return res.status(404).json({message: "No such event found."})
    }

    res.status(200).json(event)
}

//Update event by ID
const updateEvent = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such event.'})
    }
    const updatedEvent = await Event.findByIdAndUpdate(id, req.body, {new: true});

    if (!updatedEvent) {
        return res.status(404).json({message: "No such event found."})
    }
    res.status(200).json(updatedEvent)
}

//Delete event by ID
const deleteEvent = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such event.'})
    }

    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
        return res.status(404).json({message: "No such event found."})
    }
    res.status(200).json(deletedEvent)
}

module.exports = {
    addEvent, getAll, getById, updateEvent, deleteEvent
};
