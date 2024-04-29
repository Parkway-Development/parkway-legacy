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

configureBaseApiRoutes(router, addEnum, getEnums, getEnumById, updateEnumById, deleteEnumById, '/enums');

//add additional routes here
router.get('/enums/name/:name', getEnumByName);
router.patch('/enums/name/:name', updateEnumByName);
router.delete('/enums/name/:name', deleteEnumByName);

addNotFoundHandler(router);
module.exports = router;