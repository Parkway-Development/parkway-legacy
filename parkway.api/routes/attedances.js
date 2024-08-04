const express = require('express');
const router = express.Router();
const {
    addAttendance,
    getAllAttendances,
    getAttendanceById,
    updateAttendance,
    deleteAttendance,
    addAttendanceEntry,
    getAttendanceEntries,
    getAttendanceEntriesByDateRange,
    deleteAttendanceEntry,
    updateAttendanceEntry
} = require('../controllers/attendanceController')
const { addNotFoundHandler, configureBaseApiRoutes } = require("./baseApiRouter");

router.get('/bydaterange', getAttendanceEntriesByDateRange);

configureBaseApiRoutes(router, addAttendance, getAllAttendances, getAttendanceById, updateAttendance, deleteAttendance);

router.post('/:id/addEntry', addAttendanceEntry);
router.get('/:id/entries', getAttendanceEntries);
router.delete('/:attendanceId/entries/:id', deleteAttendanceEntry);
router.patch('/:attendanceId/entries/:id', updateAttendanceEntry);

addNotFoundHandler(router);
module.exports = router;