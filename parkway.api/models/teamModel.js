const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    description: {
        required: true,
        type: String
    },
    leader: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    members: {
        type: [teamMemberSchema], // Array of teamMember documents
        required: false // Not required by default, but you can remove this if unnecessary
    }
});

const teamMemberSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'member'
    }
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