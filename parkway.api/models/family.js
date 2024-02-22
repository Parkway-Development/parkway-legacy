const mongoose = require('mongoose');

const familySchema = new mongoose.Schema({
    fatherId: {
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Person'
    },
    motherId: {
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Person'
    },
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Person'
    }],
    status: {
        type: String,
        required: true,
        enum: ['Married', 'Divorced', 'Single', 'Widowed', 'Separated', 'Other']
    }
})

module.exports = mongoose.model('Family', familySchema, 'families')