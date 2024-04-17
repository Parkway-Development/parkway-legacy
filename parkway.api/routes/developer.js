const express = require('express');
const router = express.Router();

const {
    getAllApplications,
    getApplicationById,
    getApplicationByName,
    getApplicationsByType,
    addApplication,
    deleteApplication,
    replaceKey
} = require('../controllers/developerController'); // Added semicolon here

const { addNotFoundHandler } = require('./baseApiRouter');
const { requireAuthorization } = require("../middleware/auth");

requireAuthorization(router); // Changed to use middleware properly, if applicable

// Register routes
router.get('/applications', getAllApplications);
router.post('/applications', addApplication);
router.delete('/applications/:id', deleteApplication);
router.get('/applications/:id', getApplicationById);
router.get('/applications/type/:type', getApplicationsByType);
router.get('/applications/name/:name', getApplicationByName);
router.get('/keys/replace/:id', replaceKey);

addNotFoundHandler(router);

module.exports = router;
