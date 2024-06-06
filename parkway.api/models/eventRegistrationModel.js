const mongoose = require('mongoose');

const eventRegistrationSchema = new mongoose.Schema({
    event: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },
    profile: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    created: {
        required: true,
        type: Date
    },
    registrationSlots: [{
        type: String,
        required: true
    }]
});

module.exports = mongoose.model('EventRegistration', eventRegistrationSchema, 'eventRegistrations')