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

const { addNotFoundHandler, configureBaseApiRoutes } = require("../baseApiRouter");

// const { requireAuthorization} = require("../../middleware/auth");
// requireAuthorization(router);
const { requireAppAndKeyValidation } = require('../../middleware/validateApiKey');
requireAppAndKeyValidation(router);
configureBaseApiRoutes(router, addExpense, getAllExpenses, getExpenseById, updateExpense, deleteExpense);

//Get expenses by vendor
router.get('/expenses/vendor/:id', getExpensesByVendor)

//Get expenses by fund
router.get('/expenses/fund/:id', getExpensesByFund)

addNotFoundHandler(router);

module.exports = router;