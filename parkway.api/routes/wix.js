const express = require('express');
const { requireAuthorization} = require("../auth");
const router = express.Router();
requireAuthorization(router);

const{
    kwRegisterChild,
    kwGetAllRegistrations,
    kwGetRegistrationById,
    kwUpdateRegistration,
    kwDeleteRegistration
} = require('../controllers/wixController')

// Register child for Kids World
router.post('/kw/register', kwRegisterChild)

// Get all Kids World registrations
router.get('/kw', kwGetAllRegistrations)

// Get Kids World registration by id
router.get('/kw/:id', kwGetRegistrationById)

// Update Kids World registration by id
router.patch('/kw/:id', kwUpdateRegistration)

// Delete Kids World registration by id
router.delete('/kw/:id', kwDeleteRegistration)

module.exports = router;