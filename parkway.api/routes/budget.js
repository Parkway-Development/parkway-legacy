const express = require('express');
const { requireAuthorization} = require("../auth");
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
} = require('../controllers/budgetController')

//Post a budget
router.post('/budgets', addBudget)

//Get all budgets
router.get('/budgets', getAllBudgets)

//Get budget by ID
router.get('/budgets/:id', getBudgetById)

//Get budgets by year
router.get('/budgets/year/:year', getBudgetsByYear)

//Get budgets by fund
router.get('/budgets/fund/:id', getBudgetsByFund)

//Update a budget by ID
router.patch('/budgets/:id', updateBudget)

//Delete a budget by ID
router.delete('/budgets/:id', deleteBudget)

router.use('*', (req, res) => {
    res.status(404).json({ message: 'Not Found' });
});

module.exports = router;