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
        default: 'Active'
    },
    teams: [{
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    }]
});

module.exports = mongoose.model('Event', eventSchema, 'events')