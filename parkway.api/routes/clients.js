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

configureBaseApiRoutes(router, addClient, getAllClients, getClientById, updateClient, deleteClient);

//add additional routes here
router.get('/name/:name', getClientByName)
router.get('/accountNumber/:accountNumber', getClientByAccountNumber)
router.get('/businessPhone/:businessPhone', getClientByBusinessPhone)
router.get('/businessEmail/:businessEmail', getClientByBusinessEmail)

addNotFoundHandler(router);
module.exports = router;