const express = require('express');
const router = express.Router();
const {
    addEvent,
    getAll,
    getById,
    updateEvent,
    deleteEvent,
    approveEvent
} = require('../controllers/eventController');
const { addNotFoundHandler, configureBaseApiRoutes } = require("./baseApiRouter");

const { requireAuthorization} = require("../middleware/auth");
requireAuthorization(router);

configureBaseApiRoutes(router, addEvent, getAll, getById, updateEvent, deleteEvent);

router.patch('/:id/approve', approveEvent);

addNotFoundHandler(router);

module.exports = router;