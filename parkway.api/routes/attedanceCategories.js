const express = require('express');
const router = express.Router();
const {
    addAttendanceCategory,
    getAllAttendanceCategories,
    getAttendanceCategoryById,
    updateAttendanceCategory,
    deleteAttendanceCategory
} = require('../controllers/attendanceController')
const { addNotFoundHandler, configureBaseApiRoutes } = require("./baseApiRouter");

configureBaseApiRoutes(router, addAttendanceCategory, getAllAttendanceCategories, getAttendanceCategoryById, updateAttendanceCategory, deleteAttendanceCategory);

addNotFoundHandler(router);
module.exports = router;