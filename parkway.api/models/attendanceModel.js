const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    event: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },
    date: {
        required: true,
        type: Date
    },
    createdBy: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    created: {
        required: true,
        type: Date
    },
    total: {
        required: true,
        type: Number
    },
    categories: [{
        category: {
            required: true,
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AttendanceCategory'
        },
        count: {
            required: true,
            type: Number
        }
    }]
});

module.exports = mongoose.model('Attendance', attendanceSchema, 'attendances')