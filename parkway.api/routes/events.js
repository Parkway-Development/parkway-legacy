const express = require('express');
const router = express.Router();
const {
    addEvent,
    getAllEvents,
    getEventById,
    updateEventById,
    deleteEventById,
    deleteEventBySchedule,
    approveEventById,
    rejectEventById,
    addEventMessageById,
    registerForEvent
} = require('../controllers/eventController');
const { addNotFoundHandler, configureBaseApiRoutes } = require("./baseApiRouter");

configureBaseApiRoutes(router, addEvent, getAllEvents, getEventById, updateEventById, deleteEventById);

router.patch('/:id/approve', approveEventById);
router.patch('/:id/reject', rejectEventById);
router.post('/:id/message', addEventMessageById);
router.delete('/:id/schedule/:updateSeries', deleteEventBySchedule);
router.post('/:id/register', registerForEvent);

addNotFoundHandler(router);
module.exports = router;