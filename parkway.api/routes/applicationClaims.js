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

const { addNotFoundHandler, configureBaseApiRoutes } = require("./baseApiRouter");

// const { requireAuthorization} = require("../../middleware/auth");
// requireAuthorization(router);
const { requireAppAndKeyValidation } = require('../middleware/validateApiKey');
requireAppAndKeyValidation(router);
configureBaseApiRoutes(router, addApplicationClaim, getAllApplicationClaims, getApplicationClaimById, updateApplicationClaim, deleteApplicationClaim); 

router.get('/name/:name', getApplicationClaimByName)

router.patch('/values/:id', updateApplicationClaimValues)

addNotFoundHandler(router);

module.exports = router;