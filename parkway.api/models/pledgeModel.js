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
        type: String
    },
    fund: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fund',
    },
    profile: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    }
})

module.exports = mongoose.model('Pledge', pledgeSchema, 'pledges');

// fund: {
//     required: true,
//     enum: ['general','building','mens ministry','womens ministry','youth','missions','music','media','oasis','other'],
//     type: String,
//     default: 'unassigned',
//     lowercase: true
// },
