const express = require('express');
const router = express.Router();
const{
    addClient,
    getAllClients,
    getClientById,
    getClientByName,
    getClientByAccountNumber,
    getClientByBusinessPhone,
    getClientByBusinessEmail,
    updateClient,
    deleteClient
} = require('../controllers/clientController')

const { addNotFoundHandler, configureBaseApiRoutes } = require("./baseApiRouter");

// const { requireAuthorization} = require("../../middleware/auth");
// requireAuthorization(router);
const { requireAppAndKeyValidation } = require('../middleware/validateApiKey');
requireAppAndKeyValidation(router);

//Get client by name
router.get('/name/:name', getClientByName)

//Get client by account number
router.get('/accountNumber/:accountNumber', getClientByAccountNumber)

//Get client by business phone
router.get('/businessPhone/:businessPhone', getClientByBusinessPhone)

//Get client by business email
router.get('/businessEmail/:businessEmail', getClientByBusinessEmail)

configureBaseApiRoutes(router, addClient, getAllClients, getClientById, updateClient, deleteClient);

addNotFoundHandler(router);

module.exports = router;