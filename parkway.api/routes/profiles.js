const express = require('express');
const router = express.Router();
const {
    addProfile,
    getAllProfiles,
    getProfileById,
    getProfilesByLastName,
    getProfilesByMobilePhone,
    getProfilesByHomePhone,
    updateProfile,
    deleteProfile,
    connectUserAndProfile,
    getAllLimitedProfiles
} = require('../controllers/profileController')
const { addNotFoundHandler, configureBaseApiRoutes } = require("./baseApiRouter");

router.get('/limited', getAllLimitedProfiles)

configureBaseApiRoutes(router, addProfile, getAllProfiles, getProfileById, updateProfile, deleteProfile);

//add additional routes here
router.get('/lastname/:lastName', getProfilesByLastName)
router.get('/mobilephone/:mobilePhone', getProfilesByMobilePhone)
router.get('/homephone/:homePhone', getProfilesByHomePhone)
router.post('/join/:profileId', connectUserAndProfile)

addNotFoundHandler(router);
module.exports = router;