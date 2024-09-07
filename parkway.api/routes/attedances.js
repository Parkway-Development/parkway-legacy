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

router.get('/bydaterange', getAttendanceEntriesByDateRange);

configureBaseApiRoutes(router, addAttendanceEntry, getAttendanceEntries, getAttendanceEntryById, updateAttendanceEntry, deleteAttendanceEntry);

addNotFoundHandler(router);
module.exports = router;