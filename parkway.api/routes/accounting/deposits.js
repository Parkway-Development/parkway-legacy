const express = require('express');
const router = express.Router();
const Deposit = require('../../models/accounting/depositModel');
const { 
    addDeposit, 
    getAllDeposits, 
    getDepositById, 
    getPopulatedDepositById,
    getDepositsByDateRange,
    updateDeposit, 
    deleteDeposit, 
    processDeposit,
    executeDeposit,
    getDepositsByStatus
} = require('../../controllers/accounting/depositController')

const { addNotFoundHandler, configureBaseApiRoutes } = require('../baseApiRouter');

router.get('/bydaterange', getDepositsByDateRange);

configureBaseApiRoutes(router, addDeposit, getAllDeposits, getDepositById, updateDeposit, deleteDeposit);

//add additional routes here
router.post('/process/:id', processDeposit);
router.post('/execute/:id', executeDeposit);
router.get('/populated/:id', getPopulatedDepositById);
router.get('/bystatus/:status', getDepositsByStatus);

addNotFoundHandler(router);
module.exports = router;