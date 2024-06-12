const express = require('express');
const router = express.Router();
const{
    createOrganization,
    getAllOrganizations,
    getOrganizationById,
    getOrganizationByName,
    getOrganizationByAccountNumber,
    getOrganizationByPhone,
    getOrganizationByEmail,
    getOrganizationIdForHost,
    updateOrganization,
    deleteOrganization,
    updateAppSettings
} = require('../controllers/organizationController')
const { addNotFoundHandler, configureBaseApiRoutes } = require("./baseApiRouter");

router.get('/lookup', getOrganizationIdForHost);

configureBaseApiRoutes(router, createOrganization, getAllOrganizations, getOrganizationById, updateOrganization, deleteOrganization);

//add additional routes here
router.get('/name/:name', getOrganizationByName)
router.get('/accountNumber/:accountNumber', getOrganizationByAccountNumber)
router.get('/phone/:phone', getOrganizationByPhone)
router.get('/email/:email', getOrganizationByEmail)
router.get('/appSettings/:id', updateAppSettings)

addNotFoundHandler(router);
module.exports = router;