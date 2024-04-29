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

configureBaseApiRoutes(router, addLiability, getAllLiabilities, getLiabilityById, updateLiability, deleteLiability);

//add additional routes here
router.get('/liabilities/fund/:id', getLiabilitiesByFund)
router.get('/liabilities/category/:category', getLiabilitiesByCategory)

addNotFoundHandler(router);
module.exports = router;