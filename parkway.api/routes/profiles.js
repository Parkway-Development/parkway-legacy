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
const { requireAppAndKeyValidation } = require('../middleware/validateApiKey');
const { requireAuthorization} = require("../middleware/auth");
requireAuthorization(router);
requireAppAndKeyValidation(router);
addNotFoundHandler(router);
configureBaseApiRoutes(router, addProfile, getAll, getById, updateProfile, deleteProfile);

router.get('/lastname/:lastName', getByLastName)
router.get('/mobilenumber/:mobileNumber', getByMobileNumber)
router.get('/homenumber/:homeNumber', getByHomeNumber)
router.post('/join/:profileId', connectUserAndProfile)

module.exports = router;