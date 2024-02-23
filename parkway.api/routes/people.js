const express = require('express');
const {
    addPerson,
    getAll,
    getById,
    getByLastName,
    getByMobile,
    updatePerson,
    deletePerson
} = require('../controllers/personController')

const router = express.Router();

//Post a Person
router.post('/people', addPerson)

//Get all People
router.get('/people', getAll)

//Get Person by ID
router.get('/people/id/:id', getById)

//Get people by last name
router.get('/people/lastname/:lastname', getByLastName)

//Get people by mobile number
router.get('/people/mobile/:mobile', getByMobile)

//Update a user by id
router.patch('/people/:id', updatePerson)

//Delete by id
router.delete('/people/:id', deletePerson)

module.exports = router;