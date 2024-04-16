const express = require('express');
const router = express.Router();
const {
    getAllApplications,
    getApplicationById,
    getApplicationByName,
    getApplicationsByType,
    addApplication,
    updateApplication,
    deleteApplication
} = require('../../controllers/developer/applicationsController');
const { addNotFoundHandler } = require('../baseApiRouter');
const { requireAuthorization} = require("../../middleware/auth");
requireAuthorization(router);


console.log(router.all);

//Get all Applications
router.get('/', getAllApplications);

//Add Application
router.post('/', addApplication);

//Update Application
router.put('/:id', updateApplication);

//Delete Application
router.delete('/:id', deleteApplication);

//Get Application by Id
router.get('/:id', getApplicationById);

//Get Applications by Type
router.get('/type/:type', getApplicationsByType);

//Get application by name
router.get('/name/:name', getApplicationByName);


addNotFoundHandler(router);

module.exports = router;