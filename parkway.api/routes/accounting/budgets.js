const express = require('express');
const { requireAuthorization} = require("../../auth");
const router = express.Router();
requireAuthorization(router);

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

//Get budgets by year
router.get('/budgets/year/:year', getBudgetsByYear)

//Get budgets by fund
router.get('/budgets/fund/:id', getBudgetsByFund)

configureBaseApiRoutes(router, addBudget, getAllBudgets, getBudgetById, updateBudget, deleteBudget);

addNotFoundHandler(router);

module.exports = router;