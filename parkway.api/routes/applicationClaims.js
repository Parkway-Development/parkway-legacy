const express = require('express');
const router = express.Router();
const {
    addApplicationClaim,
    getAllApplicationClaims,
    getApplicationClaimById,
    getApplicationClaimByName,
    updateApplicationClaim,
    deleteApplicationClaim,
    updateApplicationClaimValues
} = require('../controllers/applicationClaimController');

// Require authorization for all routes below this point
const { requireAuthorization} = require("../auth");
requireAuthorization(router);

// Require api key for all routes below this point
const { requireAppAndKeyValidation } = require('../middleware/validateApiKey');
requireAppAndKeyValidation(router);

// Set up base API routes
const { addNotFoundHandler, configureBaseApiRoutes } = require("./baseApiRouter");
configureBaseApiRoutes(router, addApplicationClaim, getAllApplicationClaims, getApplicationClaimById, updateApplicationClaim, deleteApplicationClaim); 

router.get('/name/:name', getApplicationClaimByName)

router.patch('/values/:id', updateApplicationClaimValues)

addNotFoundHandler(router);

module.exports = router;