const mongoose = require('mongoose');

const wixKidsWorldRegistrationSchema = new mongoose.Schema({
    childFirstName: {
        required: true,
        type: String
    },
    childLastName: {
        required: true,
        type: String
    },
    responsiblePartyFirstName: {
        required: true,
        type: String
    },
    responsiblePartyLastName: {
        required: true,
        type: String
    },
    relationship: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String,
        unique: true
    },
    mobilePhone: {
        required: true,
        type: String
    },
}, {timestamps: true})

module.exports = mongoose.model('WixKidsWorldRegistration', wixKidsWorldRegistrationSchema, 'wixkidsworldregistrations')