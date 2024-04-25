const express = require('express');
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

const { addNotFoundHandler, configureBaseApiRoutes } = require('../baseApiRouter');
const { requireAppAndKeyValidation } = require('../../middleware/validateApiKey');
const { requireAuthorization} = require("../../middleware/auth");
requireAuthorization(router);
requireAppAndKeyValidation(router);
addNotFoundHandler(router);
configureBaseApiRoutes(router, addContribution, getAllContributions, getContributionById, updateContribution, deleteContribution);

router.get('/type/:type', getContributionsByType)
router.get('/profile/:id', getContributionsByProfileId)
router.get('/account/:id', getContributionsByAccountId)

module.exports = router;