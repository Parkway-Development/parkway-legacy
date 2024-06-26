const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    description: {
        type: String
    },
    leaderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
    }]
});

module.exports = mongoose.model('Team', teamSchema, 'teams')