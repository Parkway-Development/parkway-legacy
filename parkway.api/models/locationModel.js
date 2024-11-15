const mongoose = require('mongoose');
const { addressSchema } = require('./sharedModels');

const locationSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    description: {
        type: String
    },
    address: {
        type: addressSchema
    },
}, {timestamps: true})

module.exports = mongoose.model('Location', locationSchema, 'locations')
