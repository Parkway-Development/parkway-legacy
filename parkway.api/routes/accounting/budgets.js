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

const { addNotFoundHandler, configureBaseApiRoutes } = require('../baseApiRouter');
configureBaseApiRoutes(router, addBudget, getAllBudgets, getBudgetById, updateBudget, deleteBudget);

//add additional routes here
router.get('/budgets/year/:year', getBudgetsByYear)
router.get('/budgets/fund/:id', getBudgetsByFund)

addNotFoundHandler(router);
module.exports = router;
