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
const { requireAppAndKeyValidation } = require('../middleware/validateApiKey');
const { requireAuthorization} = require("../middleware/auth");
requireAuthorization(router);
requireAppAndKeyValidation(router);
addNotFoundHandler(router);
configureBaseApiRoutes(router, addEventCategory, getAll, getById, updateEventCategory, deleteEventCategory);

module.exports = router;