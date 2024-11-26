const mongoose = require('mongoose');
const Address = require('./sharedModels').addressSchema;

const venueSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    address: Address,
    status: {
        required: true,
        type: String,
        default: 'Active'
    }
});

module.exports = mongoose.model('Venue', venueSchema, 'venues');