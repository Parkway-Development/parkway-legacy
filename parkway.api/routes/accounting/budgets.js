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
const { requireAppAndKeyValidation } = require('../../middleware/validateApiKey');
const { requireAuthorization} = require('../../middleware/auth');
requireAuthorization(router);
requireAppAndKeyValidation(router);
addNotFoundHandler(router);
configureBaseApiRoutes(router, addBudget, getAllBudgets, getBudgetById, updateBudget, deleteBudget);

router.get('/budgets/year/:year', getBudgetsByYear)
router.get('/budgets/fund/:id', getBudgetsByFund)

module.exports = router;