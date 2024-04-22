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

// const { requireAuthorization} = require("../../middleware/auth");
// requireAuthorization(router);
const { requireAppAndKeyValidation } = require('../../middleware/validateApiKey');
requireAppAndKeyValidation(router);
configureBaseApiRoutes(router, addAccount, getAllAccounts, getAccountById, updateAccount, deleteAccount);

//Get a fund by name
router.get('/name/:name', getAccountByName)

addNotFoundHandler(router);

module.exports = router;