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

const { addNotFoundHandler, configureBaseApiRoutes } = require("../baseApiRouter");

const { requireAuthorization} = require("../../middleware/auth");
requireAuthorization(router);

//Get payrolls by employee
router.get('/payrolls/employee/:id', getPayrollsByEmployee)

configureBaseApiRoutes(router, addPayroll, getAllPayrolls, getPayrollById, updatePayroll, deletePayroll);

addNotFoundHandler(router);

module.exports = router;