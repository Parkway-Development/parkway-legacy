const express = require('express');
const router = express.Router();
const {
    addAttendanceEntry,
    getAttendanceEntries,
    getAttendanceEntriesByDateRange,
    deleteAttendanceEntry,
    updateAttendanceEntry
} = require('../controllers/attendanceController')
const { addNotFoundHandler } = require("./baseApiRouter");

router.get('/bydaterange', getAttendanceEntriesByDateRange);

router.post('/:id/addEntry', addAttendanceEntry);
router.get('/:id/entries', getAttendanceEntries);
router.delete('/:attendanceId/entries/:id', deleteAttendanceEntry);
router.patch('/:attendanceId/entries/:id', updateAttendanceEntry);

addNotFoundHandler(router);
module.exports = router;