const express = require('express');
const router = express.Router();
const {
    getEnums,
    getEnumByName,
    getEnumById,
    addEnum,
    updateEnumById,
    updateEnumByName,
    deleteEnumById,
    deleteEnumByName
} = require('../controllers/platformController')

const { addNotFoundHandler, configureBaseApiRoutes } = require("./baseApiRouter");

// const { requireAuthorization} = require("../../middleware/auth");
// requireAuthorization(router);
const { requireAppAndKeyValidation } = require('../middleware/validateApiKey');
requireAppAndKeyValidation(router);
configureBaseApiRoutes(router, addEnum, getEnums, getEnumById, updateEnumById, deleteEnumById, '/enums');

//Get enum by name
router.get('/enums/name/:name', getEnumByName);

//Update enum
router.patch('/enums/name/:name', updateEnumByName);

//Delete enum
router.delete('/enums/name/:name', deleteEnumByName);

addNotFoundHandler(router);

module.exports = router;