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

//Post an expense
router.post('/expense', addExpense)

//Get all expenses
router.get('/expenses', getAllExpenses)

//Get expense by ID
router.get('/expenses/:id', getExpenseById)

//Get expenses by vendor
router.get('/expenses/vendor/:id', getExpensesByVendor)

//Get expenses by fund
router.get('/expenses/fund/:id', getExpensesByFund)

//Update an expense by ID
router.patch('/expenses/:id', updateExpense)

//Delete an expense by ID
router.delete('/expenses/:id', deleteExpense)

router.use('*', (req, res) => {
    res.status(404).json({ message: 'Not Found' });
});

module.exports = router;