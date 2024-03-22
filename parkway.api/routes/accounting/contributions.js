const express = require('express');
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

const { requireAuthorization } = require("../../auth");
const router = express.Router();

requireAuthorization(router);

//Post a contribution
router.post('/', addContribution)

//Get all contributions
router.get('/', getAllContributions)

//Get contribution by ID
router.get('/:id', getContributionById)

//Get contributions by type
router.get('/type/:type', getContributionsByType)

//Get contributions by Profile ID
router.get('/profile/:id', getContributionsByProfileId)

//Get contributions by Account ID
router.get('/account/:id', getContributionsByAccountId)

//Update a contribution by ID
router.patch('/:id', updateContribution)

//Delete a contribution by ID
router.delete('/:id', deleteContribution)

module.exports = router;