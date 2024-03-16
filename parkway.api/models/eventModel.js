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
        type: String
    },
    status: {
        required: true,
        type: String,
        default: 'Active'
    }
});

module.exports = mongoose.model('Event', eventSchema, 'events')