const express = require('express');
const router = express.Router();

const{
    addAccount,
    getAllAccounts,
    getAccountById,
    getAccountByName,
    updateAccount,
    deleteAccount
} = require('../../controllers/accounting/accountController')

const { addNotFoundHandler, configureBaseApiRoutes } = require("../baseApiRouter");

configureBaseApiRoutes(router, addAccount, getAllAccounts, getAccountById, updateAccount, deleteAccount);

const { requireAuthorization} = require("../../middleware/auth");
requireAuthorization(router);

//Get a fund by name
router.get('/name/:name', getAccountByName)

addNotFoundHandler(router);

module.exports = router;