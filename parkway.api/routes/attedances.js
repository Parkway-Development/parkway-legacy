const express = require('express');
const router = express.Router();
const {
    addAttendance,
    getAllAttendances,
    getAttendanceById,
    updateAttendance,
    deleteAttendance
} = require('../controllers/attendanceController')
const { addNotFoundHandler, configureBaseApiRoutes } = require("./baseApiRouter");

configureBaseApiRoutes(router, addAttendance, getAllAttendances, getAttendanceById, updateAttendance, deleteAttendance);

//add additional routes here

addNotFoundHandler(router);
module.exports = router;