const express = require('express');
const {
    addProfile,
    getAll,
    getById,
    getByLastName,
    getByMobileNumber,
    getByHomeNumber,
    updateProfile,
    deleteProfile,
    connectUserAndProfile
} = require('../controllers/profileController')

const { requireAuthorization} = require("../auth");

const router = express.Router();

requireAuthorization(router);

//Post a profile
router.post('/', addProfile)

//Get all profiles
router.get('/', getAll)

//Get profile by ID
router.get('/id/:id', getById)

//Get profiles by last name
router.get('/lastname/:lastName', getByLastName)

//Get profiles by mobile number
router.get('/mobile/:mobileNumber', getByMobileNumber)

//Get profiles by home number
router.get('/home/:homeNumber', getByHomeNumber)

//Update a profile by id
router.patch('/:id', updateProfile)

//Delete profile by id
router.delete('/:id', deleteProfile)

//Join a profile with a user
router.post('/join/:profileId', connectUserAndProfile)

router.use('*', (req, res) => {
    res.status(404).json({ message: 'Not Found' });
});

module.exports = router;