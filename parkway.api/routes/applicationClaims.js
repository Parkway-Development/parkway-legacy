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

configureBaseApiRoutes(router, addApplicationClaim, getAllApplicationClaims, getApplicationClaimById, updateApplicationClaim, deleteApplicationClaim); 

//add additional routes here
router.get('/name/:name', getApplicationClaimByName)
router.patch('/values/:id', updateApplicationClaimValues)

addNotFoundHandler(router);
module.exports = router;