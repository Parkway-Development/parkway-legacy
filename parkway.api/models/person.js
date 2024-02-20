const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
    firstname: {
        required: true,
        type: String
    },
    lastname: {
        required: true,
        type: String
    },
    middleinitial: {
        required: false,
        type: String
    },
    dateofbirth: {
        required: false,
        type: Date
    },
    gender: {
        required: false,
        type: String,
        enum: ['Male','Female']
    },
    email: {
        required: false,
        type: String
    },
    mobile: {
        required: false,
        type: String
    },
    streetaddress1: {
        required: false,
        type: String
    },
    streetaddress2: {
        required: false,
        type: String
    },
    city: {
        required: false,
        type: String
    },
    state: {
        required: false,
        type: String
    },
    zip: {
        required: false,
        type: String
    },
    // member:{
    //     required: true,
    //     default: false,
    //     type: Boolean
    // },
    // status:{
    //     type: String,
    //     required: true,
    //     enum: ['Active', 'Inactive', 'Deceased','Visitor']
    // },
    // applicationroles: [{
    //     type: String,
    //     required: true,
    //     enum: ['admin', 'user', 'editor', 'person']
    // }],
    // organizationalroles: [{
    //     type: String,
    //     required: true,
    //     enum: ['Pastor', 'Leader', 'Elder', 'Deacon','Lay Person']
    // }],
    // team: [{
    //     type: String,
    //     required: true,
    //     enum: ['Worship','Outreach','Discipleship','Fellowship','Youth','Children','Mens Ministry','Womens Ministry','Seniors Ministry','Drama','Dance','Flags','Media','Technology','Facilities','Security','Hospitality','Usher','Greeter','Parking','Transportation','Food Ministry','Clothing Ministry','Shelter Ministry','Counseling Ministry','Prayer Ministry','Missions Ministry','Evangelism Ministry','Church Planting Ministry','Community Ministry','Education Ministry','Health Ministry','Fitness Ministry','Sports Ministry','Recreation Ministry','Arts Ministry','Crafts Ministry','Hobbies Ministry','Special Needs Ministry','Other']
    // }],
    // function: [{
    //     type: String,
    //     required: true,
    //     enum: ['Lead Pastor', 'Associate Pastor', 'Youth', 'daughter', 'uncle', 'aunt', 'cousin', 'nephew', 'niece', 'grandfather', 'grandmother', 'grandson', 'granddaughter', 'friend', 'other']
    // }],
    // family: {
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref: 'Family',
    //     required: false // Set to true if it's mandatory
    // }
})

module.exports = mongoose.model('Person', personSchema)