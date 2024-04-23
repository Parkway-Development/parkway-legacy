const express = require('express');
const router = express.Router();

const{
    addBudget,
    getAllBudgets,
    getBudgetById,
    getBudgetsByYear,
    getBudgetsByFund,
    updateBudget,
    deleteBudget
} = require('../../controllers/accounting/budgetController');

const { addNotFoundHandler, configureBaseApiRoutes } = require("../baseApiRouter");

// const { requireAuthorization} = require("../../middleware/auth");
// requireAuthorization(router);
const { requireAppAndKeyValidation } = require('../../middleware/validateApiKey');
requireAppAndKeyValidation(router);
configureBaseApiRoutes(router, addBudget, getAllBudgets, getBudgetById, updateBudget, deleteBudget);

//Get budgets by year
router.get('/budgets/year/:year', getBudgetsByYear)

//Get budgets by fund
router.get('/budgets/fund/:id', getBudgetsByFund)

addNotFoundHandler(router);

module.exports = router;