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

configureBaseApiRoutes(router, addEventCategory, getAll, getById, updateEventCategory, deleteEventCategory);

//add additional routes here

addNotFoundHandler(router);
module.exports = router;