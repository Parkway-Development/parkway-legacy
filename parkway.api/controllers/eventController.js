const mongoose = require('mongoose');
const Event = require('../models/eventModel');
const EventSchedule = require('../models/eventScheduleModel');
const { requireClaim } = require("../middleware/auth");
const { addMonths, addWeeks, set, endOfDay, differenceInDays, addDays, addYears, startOfMonth, eachDayOfInterval,
    getDay
} = require("date-fns");

const createEvents = async (event, eventSchedule) => {
    const today = new Date();
    const schedulingEnd = addMonths(today, 3);

    let getNextEventDate = undefined;

    if (eventSchedule.frequency === 'weekly') {
        getNextEventDate = (lastEventDate) => addWeeks(lastEventDate, eventSchedule.interval);
    } else if (eventSchedule.frequency === 'monthly') {
        getNextEventDate = (lastEventDate) => addMonths(lastEventDate, eventSchedule.interval);
    } else if (eventSchedule.frequency === 'yearly') {
        getNextEventDate = (lastEventDate) => addYears(lastEventDate, eventSchedule.interval);
    } else if (eventSchedule.frequency === 'custom') {
        const validDates = [];
        const lastDay = eventSchedule.end_date && eventSchedule.end_date < schedulingEnd ? eventSchedule.end_date :  schedulingEnd;
        let currentMonth = startOfMonth(eventSchedule.last_schedule_date);

        while (currentMonth < lastDay) {
            const nextMonth = addMonths(currentMonth, 1);

            const allDays = eachDayOfInterval({
                start: currentMonth,
                end: nextMonth < lastDay ? nextMonth : lastDay
            });

            eventSchedule.week_days.forEach((dayNumber) => {
                const matchingDays = allDays.filter(day => getDay(day) === dayNumber);

                eventSchedule.month_weeks.forEach((weekNumber) => {
                    if (matchingDays.length >= weekNumber) {
                        const day = matchingDays[weekNumber - 1];

                        if (day > eventSchedule.last_schedule_date) {
                            validDates.push(day);
                        }
                    }
                });
            });

            currentMonth = addMonths(currentMonth, 1);
        }

        if (validDates.length) {
            let currentDayIndex = 0;
            getNextEventDate = (_) => currentDayIndex < validDates.length ? validDates[currentDayIndex++] : undefined;
        }
    }

    if (getNextEventDate) {
        let nextEvent = getNextEventDate(eventSchedule.last_schedule_date);

        while (nextEvent && nextEvent <= schedulingEnd && (!eventSchedule.end_date || nextEvent <= endOfDay(eventSchedule.end_date))) {
            const start = set(event.start, { year: nextEvent.getFullYear(), month: nextEvent.getMonth(), date: nextEvent.getDate() });
            const daysDiff = differenceInDays(start, event.start);
            const end = addDays(event.end, daysDiff);

            const newEvent = new Event({
                name: event.name,
                description: event.description,
                organizer: event.organizer,
                start,
                end,
                location: event.location,
                category: event.category,
                status: event.status,
                teams: event.teams,
                approvedBy: event.approvedBy,
                approvedDate: event.approvedDate,
                rejectedBy: event.rejectedBy,
                rejectedDate: event.rejectedDate,
                messages: [],
                schedule: event.schedule
            });

            eventSchedule.last_schedule_date = nextEvent;
            await newEvent.save();
            await eventSchedule.save();

            nextEvent = getNextEventDate(nextEvent);
        }
    }
};

const addEvent = async (req, res) => {
    try {
        const { schedule, ...body } = req.body;
        const event = new Event(body);
        if (!event) { throw new Error("Please provide an event.") }

        let validationError = event.validateSync();
    
        if (validationError) { throw new Error(validationError.message) }

        let eventSchedule;

        if (schedule) {
            eventSchedule = new EventSchedule(schedule);

            eventSchedule.start_date = event.start;
            eventSchedule.last_schedule_date = event.start;
            validationError = eventSchedule.validateSync();

            if (validationError) {
                return res.status(400).json({message: validationError.message});
            }

            const { _id } = await eventSchedule.save();
            event.schedule = _id;
        }
    
        await event.save();

        if (eventSchedule) {
            await createEvents(event, eventSchedule);
        }

        return res.status(201).json(event);

    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
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

        if (updatedEvent.schedule) {
            await Event.updateMany({ schedule: updatedEvent.schedule }, update, { new: true });
        }
    
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

        if (updatedEvent.schedule) {
            await Event.updateMany({ schedule: updatedEvent.schedule }, update, { new: true });
        }

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

const deleteEventBySchedule = async (req, res) => {
    try{
        const {id, updateSeries} = req.params;
        if (!id) { throw new Error("Please provide an event Id.") }
        if (!updateSeries) { throw new Error("Please provide an update type.") }
        if (!mongoose.Types.ObjectId.isValid(id)) { throw new Error("Invalid ID.") }

        const event = await Event.findById(id);

        if (!event) { throw new Error("No such event found.") }
        if (!event.schedule) { throw new Error("Event does not have an associated schedule.") }

        if (updateSeries === 'all') {
            await Event.deleteMany({ schedule: event.schedule });
        } else if (updateSeries === 'future') {
            await Event.deleteMany({ schedule: event.schedule, start: { $gte: event.start } });
        } else {
            throw new Error('Invalid update series value');
        }

        res.status(200).json(event);
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
    deleteEventBySchedule,
    approveEventById, 
    rejectEventById, 
    addEventMessageById
};
