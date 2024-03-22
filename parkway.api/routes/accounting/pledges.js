const express = require('express');
const { requireAuthorization} = require("../../auth");
const router = express.Router();
requireAuthorization(router);

const{
    addPledge,
    getAllPledges,
    getPledgeById,
    getPledgesByProfile,
    updatePledge,
    deletePledge,
} = require('../../controllers/accounting/pledgeController');

const { addNotFoundHandler, configureBaseApiRoutes } = require("../baseApiRouter");

//Get pledges by profile
router.get('/pledges/profile/:id', getPledgesByProfile)

configureBaseApiRoutes(router, addPledge, getAllPledges, getPledgeById, updatePledge, deletePledge);

addNotFoundHandler(router);

module.exports = router;