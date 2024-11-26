const express = require('express');
const router = express.Router();
const {
    addVenue,
    getAllVenues,
    getVenueById,
    getVenueByName,
    updateVenueById,
    deleteVenueById
} = require('../controllers/venueController');
const { addNotFoundHandler, configureBaseApiRoutes } = require("./baseApiRouter");

configureBaseApiRoutes(router, addVenue, getAllVenues, getVenueById, updateVenueById, deleteVenueById);

//add additional routes here
router.get('/name/:name', getVenueByName);

addNotFoundHandler(router);
module.exports = router;