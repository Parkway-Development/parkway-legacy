const express = require('express');
const router = express.Router();
const {
    addEventCategory,
    getAll,
    getById,
    updateEventCategory,
    deleteEventCategory
} = require('../controllers/eventCategoryController')
const { addNotFoundHandler, configureBaseApiRoutes } = require("./baseApiRouter");

const { requireAuthorization} = require("../middleware/auth");
requireAuthorization(router, 'calendarManagement');

configureBaseApiRoutes(router, addEventCategory, getAll, getById, updateEventCategory, deleteEventCategory);

addNotFoundHandler(router);

module.exports = router;