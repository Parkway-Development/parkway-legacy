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

const { requireAuthorization} = require("../auth");
requireAuthorization(router);

configureBaseApiRoutes(router, addEvent, getAll, getById, updateEvent, deleteEvent);

addNotFoundHandler(router);

module.exports = router;