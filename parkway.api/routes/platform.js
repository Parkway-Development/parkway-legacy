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
const { requireAppAndKeyValidation } = require('../middleware/validateApiKey');
const { requireAuthorization} = require("../middleware/auth");
requireAuthorization(router);
requireAppAndKeyValidation(router);
addNotFoundHandler(router);
configureBaseApiRoutes(router, addEnum, getEnums, getEnumById, updateEnumById, deleteEnumById, '/enums');

router.get('/enums/name/:name', getEnumByName);
router.patch('/enums/name/:name', updateEnumByName);
router.delete('/enums/name/:name', deleteEnumByName);

module.exports = router;