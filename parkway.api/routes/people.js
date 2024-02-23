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
router.get('/people/:id', getById)

//Get people by last name
router.get('/people/:lastname', getByLastName)

//Get people by mobile number
router.get('/people/:mobile', getByMobile)

router.patch('/people/:id', updatePerson)

//Delete by ID Method
router.delete('/people/:id', deletePerson)

module.exports = router;