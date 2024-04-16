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
const { requireAuthorization} = require("../middleware/auth");
const router = express.Router();

const { addNotFoundHandler, configureBaseApiRoutes } = require("./baseApiRouter");
configureBaseApiRoutes(router, addProfile, getAll, getById, updateProfile, deleteProfile);
requireAuthorization(router);


//Get profiles by last name
router.get('/lastname/:lastName', getByLastName)

//Get profiles by mobile number
router.get('/mobilenumber/:mobileNumber', getByMobileNumber)

//Get profiles by home number
router.get('/homenumber/:homeNumber', getByHomeNumber)

//Join a profile with a user
router.post('/join/:profileId', connectUserAndProfile)

addNotFoundHandler(router);

module.exports = router;