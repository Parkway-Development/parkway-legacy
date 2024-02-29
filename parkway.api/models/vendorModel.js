const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
        lowercase: true
    },
    address: {
        required: false,
        type: String,
        lowercase: true
    },
    city: {
        required: false,
        type: String,
        lowercase: true
    },
    state: {
        required: false,
        type: String,
        lowercase: true
    },
    zip: {
        required: false,
        type: String
    },
    phone: {
        required: false,
        type: String
    },
    email: {
        required: false,
        type: String,
        lowercase: true
    },
    website: {
        required: false,
        type: String,
        lowercase: true
    },
    contact: {
        required: false,
        type: String,
        lowercase: true
    },
    contactPhone: {
        required: false,
        type: String
    },
    contactEmail: {
        required: false,
        type: String,
        lowercase: true
    },
    notes: {
        required: false,
        type: String,
        lowercase: true
    }
})

module.exports = mongoose.model('Vendor', vendorSchema, 'vendors')