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

router.use('*', (req, res) => {
    res.status(404).json({ message: 'Not Found' });
});

module.exports = router;