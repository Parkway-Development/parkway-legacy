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

const { addNotFoundHandler, configureBaseApiRoutes } = require("../baseApiRouter");

const { requireAuthorization} = require("../../middleware/auth");
requireAuthorization(router);

//Get liabilities by fund
router.get('/liabilities/fund/:id', getLiabilitiesByFund)

//Get liabilities by category
router.get('/liabilities/category/:category', getLiabilitiesByCategory)

configureBaseApiRoutes(router, addLiability, getAllLiabilities, getLiabilityById, updateLiability, deleteLiability);

addNotFoundHandler(router);

module.exports = router;