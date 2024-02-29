const express = require('express');
const { requireAuthorization} = require("../auth");
const router = express.Router();
requireAuthorization(router);

const{
    addDonation,
    getAllDonations,
    getDonationById,
    getDonationsByProfile,
    updateDonation,
    deleteDonation,
    addPledge,
    getAllPledges,
    getPledgeById,
    getPledgesByProfile,
    updatePledge,
    deletePledge,
    addVendor,
    getAllVendors,
    getVendorById,
    updateVendor,
    deleteVendor,
    addExpense,
    getAllExpenses,
    getExpenseById,
    getExpensesByVendor,
    getExpensesByFund,
    updateExpense,
    deleteExpense,
    addPayroll,
    getAllPayrolls,
    getPayrollById,
    getPayrollsByEmployee,
    updatePayroll,
    deletePayroll,
    addFund,
    getAllFunds,
    getFundById,
    getFundsByName,
    updateFund,
    deleteFund,
    addBudget,
    getAllBudgets,
    getBudgetById,
    getBudgetsByYear,
    getBudgetsByFund,
    updateBudget,
    deleteBudget,
    addAsset,
    getAllAssets,
    getAssetById,
    getAssetsByType,
    getAssetsByCategory,
    getAssetsByLocation,
    updateAsset,
    deleteAsset,
} = require('../controllers/accountingController')

//Donations
//Post a donation
router.post('/donations', addDonation)

//Get all donations
router.get('/donations', getAllDonations)

//Get donation by ID
router.get('/donations/:id', getDonationById)

//Get donations by profile
router.get('/donations/profile/:id', getDonationsByProfile)

//Update a donation by ID
router.patch('/donations/:id', updateDonation)

//Delete a donation by ID
router.delete('/donations/:id', deleteDonation)

//Pledges
//Post a pledge
router.post('/pledges', addPledge)

//Get all pledges
router.get('/pledges', getAllPledges)

//Get pledge by ID
router.get('/pledges/:id', getPledgeById)

//Get pledges by profile
router.get('/pledges/profile/:id', getPledgesByProfile)

//Update a pledge by ID
router.patch('/pledges/:id', updatePledge)

//Delete a pledge by ID
router.delete('/pledges/:id', deletePledge)

//Vendors
//Post a vendor
router.post('/vendors', addVendor)

//Get all vendors
router.get('/vendors', getAllVendors)

//Get vendor by ID
router.get('/vendors/:id', getVendorById)

//Update a vendor by ID
router.patch('/vendors/:id', updateVendor)

//Delete a vendor by ID
router.delete('/vendors/:id', deleteVendor)

//Expenses
//Post an expense
router.post('/expenses', addExpense)

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

//Payroll
//Post a payroll
router.post('/payrolls', addPayroll)

//Get all payrolls
router.get('/payrolls', getAllPayrolls)

//Get payroll by ID
router.get('/payrolls/:id', getPayrollById)

//Get payrolls by employee
router.get('/payrolls/employee/:id', getPayrollsByEmployee)

//Update a payroll by ID
router.patch('/payrolls/:id', updatePayroll)

//Delete a payroll by ID
router.delete('/payrolls/:id', deletePayroll)

//Funds
//Post a fund
router.post('/funds', addFund)

//Get all funds
router.get('/funds', getAllFunds)

//Get fund by ID
router.get('/funds/:id', getFundById)

//Get a fund by name
router.get('/funds/name/:name', getFundsByName)

//Update a fund by ID
router.patch('/funds/:id', updateFund)

//Delete a fund by ID
router.delete('/funds/:id', deleteFund)

//Budgets
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

//Assets
//Post an asset
router.post('/assets', addAsset)

//Get all assets
router.get('/assets', getAllAssets)

//Get asset by ID
router.get('/assets/:id', getAssetById)

//Get assets by type
router.get('/assets/type/:type', getAssetsByType)

//Get assets by category
router.get('/assets/category/:category', getAssetsByCategory)

//Get assets by location
router.get('/assets/location/:location', getAssetsByLocation)

//Update an asset by ID
router.patch('/assets/:id', updateAsset)

//Delete an asset by ID
router.delete('/assets/:id', deleteAsset)

module.exports = router;