const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    description: {
        required: false,
        type: String
    },
    organizer: {
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    start: {
        required: true,
        type: Date
    },
    end: {
        required: true,
        type: Date
    },
    location: {
        required: false,
        type: String
    },
    category: {
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EventCategory'
    },
    status: {
        required: true,
        type: String,
        default: 'Tentative'
    },
    teams: [{
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    }],
    approvedBy: {
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    approvedDate: {
        required: false,
        type: Date
    },
    rejectedBy: {
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    rejectedDate: {
        required: false,
        type: Date
    },
    messages: [{
        profile: {
            required: true,
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profile'
        },
        messageDate: {
            required: true,
            type: Date
        },
        message: {
            required: true,
            type: String
        }
    }],
    eventSchedule: {
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EventSchedule'
    }
});

module.exports = mongoose.model('Event', eventSchema, 'events')