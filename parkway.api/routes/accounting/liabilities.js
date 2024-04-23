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

// const { requireAuthorization} = require("../../middleware/auth");
// requireAuthorization(router);
const { requireAppAndKeyValidation } = require('../../middleware/validateApiKey');
requireAppAndKeyValidation(router);
configureBaseApiRoutes(router, addLiability, getAllLiabilities, getLiabilityById, updateLiability, deleteLiability);

//Get liabilities by fund
router.get('/liabilities/fund/:id', getLiabilitiesByFund)

//Get liabilities by category
router.get('/liabilities/category/:category', getLiabilitiesByCategory)

addNotFoundHandler(router);

module.exports = router;