const mongoose = require('mongoose');

const attendanceCategorySchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    description: {
        required: false,
        type: String
    }
});

module.exports = mongoose.model('AttendanceCategory', attendanceCategorySchema, 'attendanceCategories')