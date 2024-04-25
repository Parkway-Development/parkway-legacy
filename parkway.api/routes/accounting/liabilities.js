const express = require('express');
const router = express.Router();
const{
    addLiability,
    getAllLiabilities,
    getLiabilityById,
    getLiabilitiesByFund,
    getLiabilitiesByCategory,
    updateLiability,
    deleteLiability
} = require('../../controllers/accounting/liabilityController')

const { addNotFoundHandler, configureBaseApiRoutes } = require('../baseApiRouter');
const { requireAppAndKeyValidation } = require('../../middleware/validateApiKey');
const { requireAuthorization} = require('../../middleware/auth');
requireAuthorization(router);
requireAppAndKeyValidation(router);
addNotFoundHandler(router);
configureBaseApiRoutes(router, addLiability, getAllLiabilities, getLiabilityById, updateLiability, deleteLiability);

router.get('/liabilities/fund/:id', getLiabilitiesByFund)
router.get('/liabilities/category/:category', getLiabilitiesByCategory)

module.exports = router;