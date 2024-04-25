const express = require('express');
const router = express.Router();
const{
addExpense,
getAllExpenses,
getExpenseById,
getExpensesByVendor,
getExpensesByFund,
updateExpense,
deleteExpense
} = require('../../controllers/accounting/expenseController')

const { addNotFoundHandler, configureBaseApiRoutes } = require('../baseApiRouter');
const { requireAppAndKeyValidation } = require('../../middleware/validateApiKey');
const { requireAuthorization} = require('../../middleware/auth');
requireAuthorization(router);
requireAppAndKeyValidation(router);
addNotFoundHandler(router);configureBaseApiRoutes(router, addExpense, getAllExpenses, getExpenseById, updateExpense, deleteExpense);

router.get('/expenses/vendor/:id', getExpensesByVendor)
router.get('/expenses/fund/:id', getExpensesByFund)

module.exports = router;