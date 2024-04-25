const express = require('express');
const router = express.Router();
const{
    addPayroll,
    getAllPayrolls,
    getPayrollById,
    getPayrollsByEmployee,
    updatePayroll,
    deletePayroll
} = require('../../controllers/accounting/payrollController')

const { addNotFoundHandler, configureBaseApiRoutes } = require('../baseApiRouter');
const { requireAppAndKeyValidation } = require('../../middleware/validateApiKey');
const { requireAuthorization} = require('../../middleware/auth');
requireAuthorization(router);
requireAppAndKeyValidation(router);
addNotFoundHandler(router);configureBaseApiRoutes(router, addPayroll, getAllPayrolls, getPayrollById, updatePayroll, deletePayroll);

router.get('/payrolls/employee/:id', getPayrollsByEmployee)

module.exports = router;