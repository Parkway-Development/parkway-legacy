const express = require('express');
const { requireAuthorization} = require("../../auth");
const router = express.Router();
requireAuthorization(router);

const{
addExpense,
getAllExpenses,
getExpenseById,
getExpensesByVendor,
getExpensesByFund,
updateExpense,
deleteExpense
} = require('../../controllers/accounting/expenseController')

const { addNotFoundHandler, configureBaseApiRoutes } = require("../baseApiRouter");

//Get expenses by vendor
router.get('/expenses/vendor/:id', getExpensesByVendor)

//Get expenses by fund
router.get('/expenses/fund/:id', getExpensesByFund)

configureBaseApiRoutes(router, addExpense, getAllExpenses, getExpenseById, updateExpense, deleteExpense);

addNotFoundHandler(router);

module.exports = router;