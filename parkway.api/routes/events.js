const express = require('express');
const router = express.Router();
const {
    addEvent,
    getAll,
    getById,
    updateEvent,
    deleteEvent,
    approveEvent,
    rejectEvent
} = require('../controllers/eventController');
const { addNotFoundHandler, configureBaseApiRoutes } = require("./baseApiRouter");

const { requireAuthorization} = require("../middleware/auth");
requireAuthorization(router);

configureBaseApiRoutes(router, addEvent, getAll, getById, updateEvent, deleteEvent);

router.patch('/:id/approve', approveEvent);
router.patch('/:id/reject', rejectEvent);

addNotFoundHandler(router);

module.exports = router;