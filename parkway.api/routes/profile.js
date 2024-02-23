const express = require('express');
const {
    addProfile,
    getAll,
    getById,
    getByLastName,
    getByMobile,
    updateProfile,
    deleteProfile
} = require('../controllers/profileController')

const router = express.Router();

//Post a profile
router.post('/', addProfile)

//Get all profiles
router.get('/', getAll)

//Get profile by ID
router.get('/id/:id', getById)

//Get profiles by last name
router.get('/lastname/:lastname', getByLastName)

//Get profiles by mobile number
router.get('/mobile/:mobile', getByMobile)

//Update a profile by id
router.patch('/:id', updateProfile)

//Delete profile by id
router.delete('/:id', deleteProfile)

module.exports = router;