const mongoose = require('mongoose');

const familySchema = new mongoose.Schema({
    father: {
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    mother: {
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    }],
    status: {
        type: String,
        required: false
    }
}, {timestamps: true})

module.exports = mongoose.model('Family', familySchema, 'families')