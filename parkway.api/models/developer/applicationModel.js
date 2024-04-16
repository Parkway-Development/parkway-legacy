const mongoose = require('mongoose');
const userModel = require('../userModel');

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
    isExternal: {
        type: Boolean,
        default: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

});

module.exports = mongoose.model('Application', applicationSchema, 'applications');