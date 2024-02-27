const mongoose = require('mongoose');
const shortProfileSchema = require('./profileModel').schema;

const teamSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    description: {
        required: false,
        type: String
    },
    leaderId: {
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'}
    ]
});


// teams: [{
//     type: String,
//     required: true,
//     enum: ['Worship','Outreach','Discipleship','Fellowship','Youth','Children','Mens Ministry','Womens Ministry','Seniors Ministry','Drama','Dance','Flags','Media','Technology','Facilities','Security','Hospitality','Usher','Greeter','Parking','Transportation','Food Ministry','Clothing Ministry','Shelter Ministry','Counseling Ministry','Prayer Ministry','Missions Ministry','Evangelism Ministry','Church Planting Ministry','Community Ministry','Education Ministry','Health Ministry','Fitness Ministry','Sports Ministry','Recreation Ministry','Arts Ministry','Crafts Ministry','Hobbies Ministry','Special Needs Ministry','Other']
// }],

// teamRole: [{
//     type: String,
//     required: true,
//     enum: ['Lead Pastor', 'Associate Pastor', 'Youth', 'daughter', 'uncle', 'aunt', 'cousin', 'nephew', 'niece', 'grandfather', 'grandmother', 'grandson', 'granddaughter', 'friend', 'other']
// }],

module.exports = mongoose.model('Team', teamSchema, 'teams')