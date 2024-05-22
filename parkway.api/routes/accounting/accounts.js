const express = require('express');
const router = express.Router();
const{
    createRevenueAccount,
    createFundAccount,
    getAllAccounts,
    getAccountById,
    getAccountByName,
    getAccountsByType,
    updateAccountById,
    updateAccountCustodian,
    addAccountParent,
    addAccountChildren,
    deleteAccountById
} = require('../../controllers/accounting/accountController')
const { addNotFoundHandler } = require('../baseApiRouter');

router.get('/' , getAllAccounts)
router.get('/:id', getAccountById)
router.patch('/update/:id', updateAccountById)
router.delete('/delete/:id', deleteAccountById)

//add additional routes here
router.post('/revenue', createRevenueAccount)
router.post('/fund', createFundAccount)
router.get('/name/:name', getAccountByName)
router.get('/type/:type', getAccountsByType)
router.patch('/updatecustodian/:accountId', updateAccountCustodian)
router.patch('/addparent/:accountId', addAccountParent)
router.patch('/addchildren/:accountId', addAccountChildren)

addNotFoundHandler(router);
module.exports = router;