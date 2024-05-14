const express = require('express');
const router = express.Router();
const Deposit = require('../../models/accounting/depositModel');
const { 
    addDeposit, 
    getAllDeposits, 
    getDepositById, 
    getPopulatedDepositById,
    updateDeposit, 
    deleteDeposit, 
    processDeposit } = require('../../controllers/accounting/depositController')

const { addNotFoundHandler, configureBaseApiRoutes } = require('../baseApiRouter');
configureBaseApiRoutes(router, addDeposit, getAllDeposits, getDepositById, updateDeposit, deleteDeposit);

//add additional routes here
router.post('/process/:id', processDeposit);
router.get('/populated/:id', getPopulatedDepositById);

addNotFoundHandler(router);
module.exports = router;