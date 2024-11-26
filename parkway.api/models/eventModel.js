const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    description: {
        type: String
    },
    organizer: {
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
    allDay: {
        required: true,
        type: Boolean,
        default: false
    },
    venue: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Venue'
    },
    category: {
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    approvedDate: {
        type: Date
    },
    rejectedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    rejectedDate: {
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
    schedule: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EventSchedule'
    },
    allowRegistrations: {
        required: true,
        type: Boolean,
        default: false
    },
    registrationSlots: [{
        slotId: {
            required: true,
            type: String
        },
        name: {
            required: true,
            type: String
        },
        description: {
            required: false,
            type: String
        },
        start: {
            required: true,
            type: Date
        },
        end: {
            required: true,
            type: Date
        },
        available: {
            required: true,
            type: Boolean,
            default: true
        },
        deleted: {
            required: false,
            type: Date
        }
    }]
});

module.exports = mongoose.model('Event', eventSchema, 'events');
