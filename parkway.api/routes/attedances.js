const express = require('express');
const router = express.Router();
const {
    addAttendance,
    getAllAttendances,
    getAttendanceById,
    updateAttendance,
    deleteAttendance,
    addAttendanceEntry,
    getAttendanceEntries
} = require('../controllers/attendanceController')
const { addNotFoundHandler, configureBaseApiRoutes } = require("./baseApiRouter");

configureBaseApiRoutes(router, addAttendance, getAllAttendances, getAttendanceById, updateAttendance, deleteAttendance);

router.post('/:id/addEntry', addAttendanceEntry);
router.get('/:id/entries', getAttendanceEntries);

addNotFoundHandler(router);
module.exports = router;