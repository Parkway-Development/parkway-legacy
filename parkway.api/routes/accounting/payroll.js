const express = require('express');
const { requireAuthorization} = require("../../auth");
const router = express.Router();
requireAuthorization(router);

const{
    addPayroll,
    getAllPayrolls,
    getPayrollById,
    getPayrollsByEmployee,
    updatePayroll,
    deletePayroll
} = require('../../controllers/accounting/payrollController')

const { addNotFoundHandler, configureBaseApiRoutes } = require("../baseApiRouter");

//Get payrolls by employee
router.get('/payrolls/employee/:id', getPayrollsByEmployee)

configureBaseApiRoutes(router, addPayroll, getAllPayrolls, getPayrollById, updatePayroll, deletePayroll);

addNotFoundHandler(router);

module.exports = router;