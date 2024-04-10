const express = require('express');
const router = express.Router();
const {
    getAll,
    getById,
    getByName,
    addApplication,
    updateApplication,
    deleteApplication
} = require('../../controllers/apikey/applicationController');
const { addNotFoundHandler, configureBaseApiRoutes } = require("./baseApiRouter");
const { requireAuthorization} = require("../middleware/auth");
requireAuthorization(router);
configureBaseApiRoutes(router, addApplication, getAll, getById, updateApplication, deleteApplication);

//Get application by name
router.get('/name/:name', getByName);

//Get External Applications
router.get('/external', getExternalApplications);

//Get Internal Applications
router.get('/internal', getInternalApplications);

addNotFoundHandler(router);

module.exports = router;