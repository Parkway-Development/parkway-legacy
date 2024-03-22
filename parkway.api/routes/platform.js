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
const { requireAuthorization} = require("../auth");
const router = express.Router();
requireAuthorization(router);

const { addNotFoundHandler, configureBaseApiRoutes } = require("./baseApiRouter");

//Get enum by name
router.get('/name/:name', getEnumByName);

//Update enum
router.patch('/name/:name', updateEnumByName);

//Delete enum
router.delete('/name/:name', deleteEnumByName);

configureBaseApiRoutes(router, addEnum, getEnums, getEnumById, updateEnumById, deleteEnumById);

addNotFoundHandler(router);

module.exports = router;