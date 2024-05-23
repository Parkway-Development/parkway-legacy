const express = require('express');
const router = express.Router();
const{
    addAccount,
    getAllAccounts,
    getAccountById,
    getAccountByName,
    updateAccountById,
    updateAccountCustodian,
    addAccountParent,
    addAccountChildren,
    deleteAccountById
} = require('../../controllers/accounting/accountController')
const { addNotFoundHandler, configureBaseApiRoutes } = require('../baseApiRouter');

configureBaseApiRoutes(router, addAccount, getAllAccounts, getAccountById, updateAccountById, deleteAccountById);

//add additional routes here
router.get('/name/:name', getAccountByName)
router.patch('/updatecustodian/:accountId', updateAccountCustodian)
router.patch('/addparent/:accountId', addAccountParent)
router.patch('/addchildren/:accountId', addAccountChildren)
addNotFoundHandler(router);
module.exports = router;