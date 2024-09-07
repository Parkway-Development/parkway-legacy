const express = require('express');
const router = express.Router();
const {
    addAttendanceEntry,
    getAttendanceEntries,
    getAttendanceEntryById,
    getAttendanceEntriesByDateRange,
    getAttendanceEntriesByEventId,
    deleteAttendanceEntry,
    updateAttendanceEntry
} = require('../controllers/attendanceController')
const { addNotFoundHandler, configureBaseApiRoutes} = require("./baseApiRouter");

router.get('/bydaterange', getAttendanceEntriesByDateRange);
router.get('/byeventid/:id', getAttendanceEntriesByEventId);

configureBaseApiRoutes(router, addAttendanceEntry, getAttendanceEntries, getAttendanceEntryById, updateAttendanceEntry, deleteAttendanceEntry);

addNotFoundHandler(router);
module.exports = router;