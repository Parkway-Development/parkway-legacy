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
    deleteExpense
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


module.exports = router;