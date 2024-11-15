const express = require('express');
const router = express.Router();
const {
    addLocation,
    getLocationById,
    deleteLocation,
    updateLocation,
    getLocations
} = require('../controllers/locationController');
const { addNotFoundHandler, configureBaseApiRoutes} = require("./baseApiRouter");

configureBaseApiRoutes(router, addLocation, getLocations, getLocationById, updateLocation, deleteLocation);

addNotFoundHandler(router);
module.exports = router;
