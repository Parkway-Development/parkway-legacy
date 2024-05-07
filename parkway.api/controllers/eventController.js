const mongoose = require('mongoose');
const Event = require('../models/eventModel');
const { requireClaim } = require("../middleware/auth");

const addEvent = async (req, res) => {
    try {
        const event = new Event(req.body);
        if (!event) { throw new Error("Please provide an event.") }

        const validationError = event.validateSync();
    
        if (validationError) { throw new Error(validationError.message) }
    
        await event.save();
        return res.status(201).json(event);

    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }

    try {
    } catch (error) {
    }
}

const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find({}).sort({start: 'desc'});

        if (!events) { throw new Error("No events were returned.") }

        res.status(200).json(events);
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

const getEventById = async (req, res) => {
    try {
        const {id} = req.params;
        if (!id) { throw new Error("Please provide an event Id.")}
        if (!mongoose.Types.ObjectId.isValid(id)) {throw new Error("Invalid ID.")}

        const event = await Event.findById(id);
    
        if (!event) { throw new Error("No event was found with that Id.") }
    
        res.status(200).json(event)
    
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

const updateEventById = async (req, res) => {
    try{
        const {id} = req.params;
        if (!id) { throw new Error("Please provide an event Id.") }
        if (!mongoose.Types.ObjectId.isValid(id)) { throw new Error("Invalid ID.") }

        // Exclude fields that shouldn't be updated using this method
        const { status, approvedBy, approvedDate, ...update } = req.body;

        const updatedEvent = await Event.findByIdAndUpdate(id, update, {new: true});

        if (!updatedEvent) { throw new Error("No such event found.") }

        res.status(200).json(updatedEvent)
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

const approveEventById = async (req, res) => {
    try {
        if (!requireClaim(req, res, 'calendarManagement')) { throw new Error("Unauthorized.") }
    
        const {id} = req.params;
        if(!id) { throw new Error("Please provide an event Id.") }
        if (!mongoose.Types.ObjectId.isValid(id)) { throw new Error("Invalid ID.") }
    
        const update = {
            approvedBy: req.body.approvedBy,
            approvedDate: req.body.approvedDate,
            status: 'Active'
        };
    
        const updatedEvent = await Event.findByIdAndUpdate(id, update, {new: true});
    
        if (!updatedEvent) { throw new Error("No such event found.") }
    
        res.status(200).json(updatedEvent);
    
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

const rejectEventById = async (req, res) => {
    try{
        if (!requireClaim(req, res, 'calendarManagement')) { throw new Error("Unauthorized.") }

        const {id} = req.params;
        if (!id) { throw new Error("Please provide an event Id.") }
        if (!mongoose.Types.ObjectId.isValid(id)) { throw new Error("Invalid ID.") }

        const update = {
            rejectedBy: req.body.rejectedBy,
            rejectedDate: req.body.rejectedDate,
            status: 'Rejected'
        };

        const updatedEvent = await Event.findByIdAndUpdate(id, update, {new: true});

        if (!updatedEvent) { throw new Error("No such event found.") }

        res.status(200).json(updatedEvent);
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

const deleteEventById = async (req, res) => {
    try{
        const {id} = req.params;
        if (!id) { throw new Error("Please provide an event Id.") }
        if (!mongoose.Types.ObjectId.isValid(id)) { throw new Error("Invalid ID.") }

        const deletedEvent = await Event.findByIdAndDelete(id);

        if (!deletedEvent) { throw new Error("No such event found.") }

        res.status(200).json(deletedEvent);
    }catch(error){
        console.log(error)
        return res.status(500).json(error)
    }
}

const addEventMessageById = async (req, res) => {
    try {
        const {id} = req.params;
        if (!id) { throw new Error("Please provide an event Id.") }
        if (!mongoose.Types.ObjectId.isValid(id)) { throw new Error("Invalid ID.") }
    
        const { profile, messageDate, message } = req.body;
    
        if (!profile || !messageDate || !message) { throw new Error("Invalid request body.") }
    
        const newMessage = {
            profile,
            messageDate,
            message
        };
    
        const updatedEvent = await Event.findByIdAndUpdate({_id: id},{$addToSet: {messages: newMessage}},{new: true})
    
        if(!updatedEvent){ throw new Error("No such event found.") }
    
        res.status(201).json(updatedEvent);
    
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

module.exports = {
    addEvent, 
    getAllEvents, 
    getEventById, 
    updateEventById, 
    deleteEventById, 
    approveEventById, 
    rejectEventById, 
    addEventMessageById
};
