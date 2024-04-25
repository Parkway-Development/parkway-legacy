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
const { requireAppAndKeyValidation } = require('../middleware/validateApiKey');
const { requireAuthorization} = require("../middleware/auth");
requireAuthorization(router);
requireAppAndKeyValidation(router);
addNotFoundHandler(router);
configureBaseApiRoutes(router, addApplicationClaim, getAllApplicationClaims, getApplicationClaimById, updateApplicationClaim, deleteApplicationClaim); 

router.get('/name/:name', getApplicationClaimByName)
router.patch('/values/:id', updateApplicationClaimValues)

module.exports = router;