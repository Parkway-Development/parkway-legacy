const express = require('express');
const router = express.Router();

const router = express.Router();

const{
    addContribution,
    getAllContributions,
    getContributionById,
    getContributionsByType,
    getContributionsByProfileId,
    getContributionsByAccountId,
    updateContribution,
    deleteContribution
} = require('../../controllers/accounting/contributionController');

const { addNotFoundHandler, configureBaseApiRoutes } = require("../baseApiRouter");

// const { requireAuthorization} = require("../../middleware/auth");
// requireAuthorization(router);
const { requireAppAndKeyValidation } = require('../../middleware/validateApiKey');
requireAppAndKeyValidation(router);
configureBaseApiRoutes(router, addContribution, getAllContributions, getContributionById, updateContribution, deleteContribution);

//Get contributions by type
router.get('/type/:type', getContributionsByType)

//Get contributions by Profile ID
router.get('/profile/:id', getContributionsByProfileId)

//Get contributions by Account ID
router.get('/account/:id', getContributionsByAccountId)

addNotFoundHandler(router);

module.exports = router;