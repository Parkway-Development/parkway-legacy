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
const { addNotFoundHandler, configureBaseApiRoutes } = require('../baseApiRouter');

configureBaseApiRoutes(router, addPledge, getAllPledges, getPledgeById, updatePledge, deletePledge);

//add additional routes here
router.get('/pledges/profile/:id', getPledgesByProfile)

addNotFoundHandler(router);
module.exports = router;