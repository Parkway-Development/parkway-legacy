const express = require('express');
const { requireAuthorization} = require("../../auth");
const router = express.Router();
requireAuthorization(router);

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

//Get liabilities by fund
router.get('/liabilities/fund/:id', getLiabilitiesByFund)

//Get liabilities by category
router.get('/liabilities/category/:category', getLiabilitiesByCategory)

configureBaseApiRoutes(router, addLiability, getAllLiabilities, getLiabilityById, updateLiability, deleteLiability);

addNotFoundHandler(router);

module.exports = router;