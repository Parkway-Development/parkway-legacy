const express = require('express');
const router = express.Router();
const Deposit = require('../../models/accounting/depositModel');
const { 
    createDeposit, 
    getAllDeposits, 
    getDepositById, 
    getDepositsByDateRange,
    updateDeposit, 
    deleteDeposit, 
    processDeposit,
    executeDeposit,
    getDepositsByStatus
} = require('../../controllers/accounting/depositController')

const { addNotFoundHandler, configureBaseApiRoutes } = require('../baseApiRouter');

router.get('/bydaterange', getDepositsByDateRange);

configureBaseApiRoutes(router, createDeposit, getAllDeposits, getDepositById, updateDeposit, deleteDeposit);

//add additional routes here
router.post('/process/:id', processDeposit);
router.post('/execute/:id', executeDeposit);
router.get('/bystatus/:status', getDepositsByStatus);

addNotFoundHandler(router);
module.exports = router;