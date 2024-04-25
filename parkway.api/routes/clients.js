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

const { addNotFoundHandler } = require("../baseApiRouter");
const { requireAppAndKeyValidation } = require('../middleware/validateApiKey');
const { requireAuthorization} = require("../middleware/auth");
requireAuthorization(router);
requireAppAndKeyValidation(router);
addNotFoundHandler(router);
configureBaseApiRoutes(router, addClient, getAllClients, getClientById, updateClient, deleteClient);

router.get('/name/:name', getClientByName)
router.get('/accountNumber/:accountNumber', getClientByAccountNumber)
router.get('/businessPhone/:businessPhone', getClientByBusinessPhone)
router.get('/businessEmail/:businessEmail', getClientByBusinessEmail)

module.exports = router;