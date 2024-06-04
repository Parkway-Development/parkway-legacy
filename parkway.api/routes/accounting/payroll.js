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

addNotFoundHandler(router);configureBaseApiRoutes(router, addPayroll, getAllPayrolls, getPayrollById, updatePayroll, deletePayroll);

//add additional routes here
router.get('/payrolls/employee/:id', getPayrollsByEmployee)

addNotFoundHandler(router);
module.exports = router;
