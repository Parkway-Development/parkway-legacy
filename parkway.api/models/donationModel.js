const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    amount: {
        required: true,
        type: Number
    },
    date: {
        required: true,
        type: Date
    },
    donationType: {
        required: true,
        type: String,
        enum: ['cash','check','credit','other','online','stock','property','goods','services'],
        lowercase: true
    },
    fund: {
        required: true,
        type: String,
        lowercase: true,
        enum: ['unassigned','general','building','mens ministry','womens ministry','youth','missions','music','media','oasis','other'],
        default: 'unassigned'
    },
    profile: {
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    }
}, {timestamps: true})

module.exports = mongoose.model('Donation', donationSchema,'donations');