const express = require('express');
const { requireAuthorization} = require("../../auth");
const router = express.Router();
requireAuthorization(router);

const{
    addAccount,
    getAllAccounts,
    getAccountById,
    getAccountByName,
    updateAccount,
    deleteAccount
} = require('../../controllers/accounting/accountController')

//Post a fund
router.post('/', addAccount)

//Get all funds
router.get('/', getAllAccounts)

//Get fund by ID
router.get('/:id', getAccountById)

//Get a fund by name
router.get('/name/:name', getAccountByName)

//Update a fund by ID
router.patch('/:id', updateAccount)

//Delete a fund by ID
router.delete('/:id', deleteAccount)

router.use('*', (req, res) => {
    res.status(404).json({ message: 'Not Found' });
});

module.exports = router;