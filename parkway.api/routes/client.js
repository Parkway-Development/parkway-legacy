const express = require('express');
const { requireAuthorization} = require("../auth");
const router = express.Router();
requireAuthorization(router);

//Add a client
router.post('/add', addClient)

//Get all clients
router.get('/all', getAllClients)

//Get client by id
router.get('/:id', getClientById)

//Get client by name
router.get('/name/:name', getClientByName)

//Get client by account number
router.get('/accountNumber/:accountNumber', getClientByAccountNumber)

//Get client by business phone
router.get('/businessPhone/:businessPhone', getClientByBusinessPhone)

//Get client by business email
router.get('/businessEmail/:businessEmail', getClientByBusinessEmail)

//Update client by id
router.patch('/:id', updateClient)

//Delete client by id
router.delete('/:id', deleteClient)

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