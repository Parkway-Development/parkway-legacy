const express = require('express');
const router = express.Router();

const{
    addPledge,
    getAllPledges,
    getPledgeById,
    getPledgesByProfile,
    updatePledge,
    deletePledge,
} = require('../../controllers/accounting/pledgeController');

const { addNotFoundHandler, configureBaseApiRoutes } = require("../baseApiRouter");

const { requireAuthorization} = require("../../middleware/auth");
requireAuthorization(router);

//Get pledges by profile
router.get('/pledges/profile/:id', getPledgesByProfile)

configureBaseApiRoutes(router, addPledge, getAllPledges, getPledgeById, updatePledge, deletePledge);

addNotFoundHandler(router);

module.exports = router;