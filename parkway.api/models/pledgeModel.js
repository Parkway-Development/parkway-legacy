const mongoose = require('mongoose');

const pledgeSchema = new mongoose.Schema({
    amount: {
        required: true,
        type: Number
    },
    startdate: {
        required: true,
        type: Date
    },
    enddate: {
        required: true,
        type: Date
    },
    frequency: {
        required: true,
        type: String,
        enum: ['weekly','bi-weekly','twice monthly','monthly','quarterly','semi-annually','annually'],
        lowercase: true
    },
    fund: {
        required: true,
        enum: ['general','building','mens ministry','womens ministry','youth','missions','music','media','oasis','other'],
        type: String,
        default: 'unassigned',
        lowercase: true
    },
    profileId: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    }
})

module.exports = mongoose.model('Pledge', pledgeSchema, 'pledges');