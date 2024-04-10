const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    applicationSecret: {
        type: String,
        required: true,
        unique: true
    },
    isExternal: [{
        type: Boolean,
        default: true
    }]
});

module.exports = mongoose.model('Application', applicationSchema, 'applications');