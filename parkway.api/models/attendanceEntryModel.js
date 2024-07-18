const mongoose = require('mongoose');

const attendanceEntrySchema = new mongoose.Schema({
    date: {
        required: true,
        type: Date
    },
    notes: {
        required: false,
        type: String
    },
    attendance: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attendance'
    },
    count: {
        required: true,
        type: Number
    }
});

module.exports = mongoose.model('AttendanceEntry', attendanceEntrySchema, 'attendanceEntries')