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
} = require('../controllers/developerController'); 
const { addNotFoundHandler, configureBaseApiRoutes } = require("./baseApiRouter");
const { authenticateToken } = require('../middleware/auth');
const { requireSpecOpsClaim } = require('../middleware/claimsValidation');
//add additional routes here that do not require authentication

//add additional routes here that require authentication
router.use(authenticateToken, requireSpecOpsClaim);
router.get('/applications', getAllApplications);
router.get('/applications/:id', getApplicationById);
router.get('/applications/type/:type', getApplicationsByType);
router.get('/applications/name/:name', getApplicationByName);
router.get('/keys/replace/:id', replaceKey);
router.post('/applications/add', addApplication);
router.delete('/applications/:id', deleteApplication);

addNotFoundHandler(router);
module.exports = router;
