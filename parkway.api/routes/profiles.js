const express = require('express');
const router = express.Router();
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

const { addNotFoundHandler, configureBaseApiRoutes } = require("./baseApiRouter");

// const { requireAuthorization} = require("../../middleware/auth");
// requireAuthorization(router);
const { requireAppAndKeyValidation } = require('../middleware/validateApiKey');
requireAppAndKeyValidation(router);
configureBaseApiRoutes(router, addProfile, getAll, getById, updateProfile, deleteProfile);

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