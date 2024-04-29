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

configureBaseApiRoutes(router, addProfile, getAll, getById, updateProfile, deleteProfile);

//add additional routes here
router.get('/lastname/:lastName', getByLastName)
router.get('/mobilenumber/:mobileNumber', getByMobileNumber)
router.get('/homenumber/:homeNumber', getByHomeNumber)
router.post('/join/:profileId', connectUserAndProfile)

addNotFoundHandler(router);
module.exports = router;