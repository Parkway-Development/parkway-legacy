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
const { requireAppAndKeyValidation } = require('../../middleware/validateApiKey');
const { requireAuthorization} = require('../../middleware/auth');
requireAuthorization(router);
requireAppAndKeyValidation(router);
addNotFoundHandler(router);
configureBaseApiRoutes(router, addPledge, getAllPledges, getPledgeById, updatePledge, deletePledge);

router.get('/pledges/profile/:id', getPledgesByProfile)

module.exports = router;