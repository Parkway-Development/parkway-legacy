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

const { addNotFoundHandler, configureBaseApiRoutes } = require("../baseApiRouter");

configureBaseApiRoutes(router, addAccount, getAllAccounts, getAccountById, updateAccount, deleteAccount);

//Get a fund by name
router.get('/name/:name', getAccountByName)

addNotFoundHandler(router);

module.exports = router;