const express = require('express');
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

const router = express.Router();

const { addNotFoundHandler, configureBaseApiRoutes } = require("./baseApiRouter");

const { requireAuthorization} = require("../middleware/auth");
requireAuthorization(router);

//Get enum by name
router.get('/enums/name/:name', getEnumByName);

//Update enum
router.patch('/enums/name/:name', updateEnumByName);

//Delete enum
router.delete('/enums/name/:name', deleteEnumByName);

configureBaseApiRoutes(router, addEnum, getEnums, getEnumById, updateEnumById, deleteEnumById, '/enums');

addNotFoundHandler(router);

module.exports = router;