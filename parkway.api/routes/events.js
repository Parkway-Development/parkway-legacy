const express = require('express');
const router = express.Router();
const {
    addEvent,
    getAll,
    getById,
    updateEvent,
    deleteEvent,
    approveEvent,
    rejectEvent,
    addEventMessage
} = require('../controllers/eventController');
const { addNotFoundHandler, configureBaseApiRoutes } = require("./baseApiRouter");

configureBaseApiRoutes(router, addEvent, getAll, getById, updateEvent, deleteEvent);

router.patch('/:id/approve', approveEvent);
router.patch('/:id/reject', rejectEvent);
router.post('/:id/message', addEventMessage);

addNotFoundHandler(router);
module.exports = router;