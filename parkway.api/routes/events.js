const express = require('express');
const router = express.Router();
const {
    addEvent,
    getAll,
    getById,
    updateEvent,
    deleteEvent
} = require('../controllers/eventController');

const { addNotFoundHandler, configureBaseApiRoutes } = require("./baseApiRouter");
const { requireAppAndKeyValidation } = require('../middleware/validateApiKey');
const { requireAuthorization} = require("../middleware/auth");
requireAuthorization(router);
requireAppAndKeyValidation(router);
addNotFoundHandler(router);
configureBaseApiRoutes(router, addEvent, getAll, getById, updateEvent, deleteEvent);

module.exports = router;