const express = require('express');
const router = express.Router();
const {
    addAttendanceEntry,
    getAttendanceEntries,
    getAttendanceEntryById,
    getAttendanceEntriesByDateRange,
    deleteAttendanceEntry,
    updateAttendanceEntry
} = require('../controllers/attendanceController')
const { addNotFoundHandler, configureBaseApiRoutes} = require("./baseApiRouter");

configureBaseApiRoutes(router, addAttendanceEntry, getAttendanceEntries, getAttendanceEntryById, updateAttendanceEntry, deleteAttendanceEntry);

router.get('/bydaterange', getAttendanceEntriesByDateRange);

addNotFoundHandler(router);
module.exports = router;