const express = require('express');
const router = express.Router();
const {
    addEventCategory,
    getAllEventCategories,
    getEventCategoryById,
    updateEventCategory,
    deleteEventCategory
} = require('../controllers/eventCategoryController')
const { addNotFoundHandler, configureBaseApiRoutes } = require("./baseApiRouter");

configureBaseApiRoutes(router, addEventCategory, getAllEventCategories, getEventCategoryById, updateEventCategory, deleteEventCategory);

//add additional routes here

addNotFoundHandler(router);
module.exports = router;