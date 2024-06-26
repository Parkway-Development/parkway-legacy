const Event = require('../models/eventModel');
const EventRegistration = require('../models/eventRegistrationModel');
const EventSchedule = require('../models/eventScheduleModel');
const Profile = require('../models/profileModel');
const { addMonths, addWeeks, set, endOfDay, differenceInDays, addDays, addYears, startOfMonth, eachDayOfInterval,
    getDay
} = require("date-fns");
const { buildAction } = require("../helpers/controllerHelper");
const { hasClaim } = require("../middleware/auth");

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

const addEvent = buildAction({
    handler: async (req, res) => {
        const {schedule, ...body} = req.body;

        if (hasClaim(req, 'calendarManagement')) {
            body.approvedBy = req.userId;
            body.approvedDate = new Date();
            body.status = 'Active';
        }

        const event = new Event(body);
        if (!event) {
            throw new Error("Please provide an event.")
        }

        let validationError = event.validateSync();

        if (validationError) {
            throw new Error(validationError.message)
        }

        let eventSchedule;

        if (schedule) {
            eventSchedule = new EventSchedule(schedule);

            eventSchedule.start_date = event.start;
            eventSchedule.last_schedule_date = event.start;
            validationError = eventSchedule.validateSync();

            if (validationError) {
                return res.status(400).json({message: validationError.message});
            }

            const {_id} = await eventSchedule.save();
            event.schedule = _id;
        }

        await event.save();

        if (eventSchedule) {
            await createEvents(event, eventSchedule);
        }

        res.status(201).json(event);
    }
});

const getAllEvents = buildAction({
    handler: async (req, res) => {
        const events = await Event.find({}).sort({start: 'desc'});

        if (!events) {
            throw new Error("No events were returned.")
        }

        res.status(200).json(events);
    }
});

const getEventById = buildAction({
    requiredParams: ['id'],
    validateIdParam: true,
    handler: async (req, res) => {
        const {id} = req.params;

        const event = await Event.findById(id)
            .populate('schedule');

        if (!event) {
            throw new Error("No event was found with that Id.")
        }

        res.status(200).json(event);
    }
});

const updateEventById = buildAction({
    requiredParams: ['id'],
    validateIdParam: true,
    handler: async (req, res) => {
        const { id } = req.params;

        // Include only fields that we want to update
        const update = {
            name: req.body.name,
            description: req.body.description ?? null,
            organizer: req.body.organizer ?? null,
            start: req.body.start,
            end: req.body.end,
            allDay: req.body.allDay,
            location: req.body.location ?? null,
            category: req.body.category ?? null,
            teams: req.body.teams,
            allowRegistrations: req.body.allowRegistrations ?? false,
            registrationSlots: req.body.registrationSlots
        };

        const {updateSeries, schedule} = req.body;

        const shouldUpdateSchedule = schedule && ['future', 'all'].includes(updateSeries);

        if (shouldUpdateSchedule) {
            schedule.start_date = update.start;
            schedule.last_schedule_date = update.start;
            const validationError = new EventSchedule(schedule).validateSync();
            if (validationError) {
                return res.status(400).json({message: validationError.message});
            }
        }

        const updatedEvent = await Event.findByIdAndUpdate(id, update, {new: true});

        if (!updatedEvent) {
            throw new Error("No such event found.")
        }

        if (shouldUpdateSchedule) {
            // Remove future events
            await Event.deleteMany({schedule: updatedEvent.schedule, start: {$gt: updatedEvent.start}});

            // Update all previous events with the event data based on the update, but leave start/end dates alone
            // for historical events
            if (updateSeries === 'all') {
                const {start, end, allDay, ...otherEventsUpdate} = update;
                await Event.updateMany({
                    schedule: updatedEvent.schedule,
                    start: {$lt: updatedEvent.start}
                }, otherEventsUpdate, {new: true});
            }

            // Update the schedule entity
            const updatedSchedule = await EventSchedule.findByIdAndUpdate(updatedEvent.schedule, schedule, {new: true});

            // Create new scheduled events for the future
            await createEvents(updatedEvent, updatedSchedule);
        }

        res.status(200).json(updatedEvent);
    }
});

const approveEventById = buildAction({
    requiredParams: ['id'],
    requiredBodyProps: ['approvedBy', 'approvedDate'],
    validateIdParam: true,
    handler: async (req, res) => {
        const { id } = req.params;
        const update = {
            approvedBy: req.body.approvedBy,
            approvedDate: req.body.approvedDate,
            status: 'Active'
        };

        const updatedEvent = await Event.findByIdAndUpdate(id, update, {new: true});

        if (!updatedEvent) {
            throw new Error("No such event found.")
        }

        if (updatedEvent.schedule) {
            await Event.updateMany({schedule: updatedEvent.schedule}, update, {new: true});
        }

        res.status(200).json(updatedEvent);
    }
});

const rejectEventById = buildAction({
    requiredParams: ['id'],
    requiredBodyProps: ['rejectedBy', 'rejectedDate'],
    validateIdParam: true,
    handler: async (req, res) => {
        const {id} = req.params;

        const update = {
            rejectedBy: req.body.rejectedBy,
            rejectedDate: req.body.rejectedDate,
            status: 'Rejected'
        };

        const updatedEvent = await Event.findByIdAndUpdate(id, update, {new: true});

        if (!updatedEvent) {
            throw new Error("No such event found.")
        }

        if (updatedEvent.schedule) {
            await Event.updateMany({schedule: updatedEvent.schedule}, update, {new: true});
        }

        res.status(200).json(updatedEvent);
    }
});

const deleteEventById = buildAction({
    requiredParams: ['id'],
    validateIdParam: true,
    handler: async (req, res) => {
        const { id } = req.params;
        const deletedEvent = await Event.findByIdAndDelete(id);

        if (!deletedEvent) {
            throw new Error("No such event found.")
        }

        res.status(200).json(deletedEvent);
    }
});

const deleteEventBySchedule = buildAction({
    requiredParams: ['id', 'updateSeries'],
    validateIdParam: true,
    handler: async (req, res) => {
        const { id, updateSeries } = req.params;

        const event = await Event.findById(id);

        if (!event) {
            throw new Error("No such event found.")
        }

        if (!event.schedule) {
            throw new Error("Event does not have an associated schedule.")
        }

        if (updateSeries === 'all') {
            await Event.deleteMany({schedule: event.schedule});
        } else if (updateSeries === 'future') {
            await Event.deleteMany({schedule: event.schedule, start: {$gte: event.start}});
        } else {
            throw new Error('Invalid update series value');
        }

        res.status(200).json(event);
    }
});

const addEventMessageById = buildAction({
    requiredParams: ['id'],
    requiredBodyProps: ['profile', 'messageDate', 'message'],
    validateIdParam: true,
    handler: async (req, res) => {
        const {id} = req.params;
        const {profile, messageDate, message} = req.body;

        const newMessage = {
            profile,
            messageDate,
            message
        };

        const updatedEvent = await Event.findByIdAndUpdate({_id: id}, {$addToSet: {messages: newMessage}}, {new: true})

        if (!updatedEvent) {
            throw new Error("No such event found.");
        }

        res.status(201).json(updatedEvent);
    }
});

const registerForEvent = buildAction({
    requiredParams: ['id'],
    requiredBodyProps: ['profile', 'slots'],
    validateIdParam: true,
    handler: async (req, res) => {
        const { id } = req.params;
        const { profile, slots } = req.body;

        const event = await Event.findById(id);
        if (!event) {
            res.status(404).json({message: 'No event found for that id'});
        }

        // Validate slots
        slots.forEach(slot => {
            const registrationSlot = event.registrationSlots.find(s => s.slotId === slot);

            if (!registrationSlot || registrationSlot.deleted) {
                return res.status(404).json({message: 'No registration slot found for that id'});
            } else if (!registrationSlot.available) {
                return res.status(400).json({message: 'Registration slot is no longer accepting registrations'});
            }
        });

        const userProfile = await Profile.findById(profile);
        if (!userProfile) {
            return res.status(404).json({message: 'No profile found for that id'});
        }

        let registration = await EventRegistration.findOneAndUpdate({event: event.id, profile},
            {
                registrationSlots: slots
            },
            { new: true });

        if (!registration) {
            // Create new if we didn't find one to update
            registration = new EventRegistration({
                event,
                profile,
                created: new Date(),
                registrationSlots: slots
            });

            const validationError = registration.validateSync();

            if (validationError) {
                return res.status(400).json({message: validationError.message});
            }

            await registration.save();
        }

        res.status(201).json(registration);
    }
});

const getEventRegistrations = buildAction({
    requiredParams: ['id'],
    validateIdParam: true,
    handler: async (req, res) => {
        const { id } = req.params;
        const events = await EventRegistration.find({event: id}).sort({created: 'asc'});

        res.status(200).json(events ?? []);
    }
});

module.exports = {
    addEvent, 
    getAllEvents, 
    getEventById, 
    updateEventById, 
    deleteEventById,
    deleteEventBySchedule,
    approveEventById, 
    rejectEventById, 
    addEventMessageById,
    registerForEvent,
    getEventRegistrations
};
