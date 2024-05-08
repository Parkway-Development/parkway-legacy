const mongoose = require('mongoose');

const eventScheduleSchema = new mongoose.Schema({
    // weekly, monthly, yearly
    frequency: {
        required: true,
        type: String
    },
    // Number at which the interval repeats
    interval: {
        required: true,
        type: Number
    },
    // 0-6 for Sunday-Saturday
    week_days: {
        required: false,
        type: [Number]
    },
    // Weeks of the month for repeat, to support first and third Wednesday of the month as an example
    month_weeks: {
        required: false,
        type: [Number]
    },
    start_date: {
        required: true,
        type: Date
    },
    last_schedule_date: {
        required: true,
        type: Date
    },
    end_date: {
        required: false,
        type: Date
    }
});

module.exports = mongoose.model('EventSchedule', eventScheduleSchema, 'eventSchedules');
