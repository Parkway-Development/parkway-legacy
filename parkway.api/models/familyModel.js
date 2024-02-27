const mongoose = require('mongoose');

const familySchema = new mongoose.Schema({
    fatherId: {
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    motherId: {
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
        required: true,
        enum: ['Married', 'Divorced', 'Single', 'Widowed', 'Separated', 'Other']
    }
}, {timestamps: true})

module.exports = mongoose.model('Family', familySchema, 'families')