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
configureBaseApiRoutes(router, addExpense, getAllExpenses, getExpenseById, updateExpense, deleteExpense);

//add additional routes here
router.get('/expenses/vendor/:id', getExpensesByVendor)
router.get('/expenses/fund/:id', getExpensesByFund)

addNotFoundHandler(router);
module.exports = router;
