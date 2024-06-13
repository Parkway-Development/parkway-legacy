const express = require('express');
const router = express.Router();
const{
    createContributions,
    getAllContributions,
    getContributionById,
    getContributionsByType,
    getContributionsByProfileId,
    getContributionsByAccountId,
    updateContribution,
    deleteContribution
} = require('../../controllers/accounting/contributionController');

const { addNotFoundHandler, configureBaseApiRoutes } = require('../baseApiRouter');
configureBaseApiRoutes(router, createContributions, getAllContributions, getContributionById, updateContribution, deleteContribution);

//add additional routes here
router.get('/type/:type', getContributionsByType)
router.get('/profile/:id', getContributionsByProfileId)
router.get('/account/:id', getContributionsByAccountId)

addNotFoundHandler(router);
module.exports = router;