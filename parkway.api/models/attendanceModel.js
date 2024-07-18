const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    description: {
        required: false,
        type: String
    }
});

module.exports = mongoose.model('Attendance', attendanceSchema, 'attendances')