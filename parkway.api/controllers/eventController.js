const mongoose = require('mongoose');
const Event = require('../models/eventModel');
const EventSchedule = require('../models/eventScheduleModel');
const { requireClaim } = require("../middleware/auth");

//Post an event
const addEvent = async (req, res) => {
    const { schedule, ...body } = req.body;

    const event = new Event(body);

    let validationError = event.validateSync();

    if (validationError) {
        return res.status(400).json({message: validationError.message});
    }

    if (schedule) {
        const eventSchedule = new EventSchedule(schedule);

        eventSchedule.start_date = event.start;
        eventSchedule.last_schedule_date = event.start;
        validationError = eventSchedule.validateSync();

        if (validationError) {
            return res.status(400).json({message: validationError.message});
        }

        const result = await eventSchedule.save();
        event.schedule = result._id;
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
    const events = await Event.find({})
        .sort({start: 'desc'});

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
    const event = await Event.findById(id)
        .populate('schedule');

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

    // Exclude fields that shouldn't be updated using this method
    const { status, approvedBy, approvedDate, ...update } = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(id, update, {new: true});

    if (!updatedEvent) {
        return res.status(404).json({message: "No such event found."})
    }
    res.status(200).json(updatedEvent)
}

//Approve an event
const approveEvent = async (req, res) => {
    if (!requireClaim(req, res, 'calendarManagement')) {
        return res;
    }

    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such event.'})
    }

    const update = {
        approvedBy: req.body.approvedBy,
        approvedDate: req.body.approvedDate,
        status: 'Active'
    };

    const updatedEvent = await Event.findByIdAndUpdate(id, update, {new: true});

    if (!updatedEvent) {
        return res.status(404).json({message: "No such event found."})
    }

    res.status(200).json(updatedEvent);
}

//Reject an event
const rejectEvent = async (req, res) => {
    if (!requireClaim(req, res, 'calendarManagement')) {
        return res;
    }

    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such event.'})
    }

    const update = {
        rejectedBy: req.body.rejectedBy,
        rejectedDate: req.body.rejectedDate,
        status: 'Rejected'
    };

    const updatedEvent = await Event.findByIdAndUpdate(id, update, {new: true});

    if (!updatedEvent) {
        return res.status(404).json({message: "No such event found."})
    }

    res.status(200).json(updatedEvent);
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
    res.status(200).json(deletedEvent);
}

//Add event message
const addEventMessage = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such event.'})
    }

    const { profile, messageDate, message } = req.body;

    if (!profile || !messageDate || !message) {
        return res.status(400).json({error: 'Invalid request body.'})
    }

    const newMessage = {
        profile,
        messageDate,
        message
    };

    const updatedEvent = await Event.findByIdAndUpdate({_id: id},{$addToSet: {messages: newMessage}},{new: true})

    if(!updatedEvent){ return res.status(404).json({message: "No such event found."}) }

    res.status(201).json(updatedEvent);
}

module.exports = {
    addEvent, getAll, getById, updateEvent, deleteEvent, approveEvent, rejectEvent, addEventMessage
};
