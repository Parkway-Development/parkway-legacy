const express = require('express');
const router = express.Router();
const{
    addApiKey,
    getAllApiKeys,
    getApiKeyById,
    deleteApiKey,
    renewApiKey
} = require('../controllers/apiKeyController');

// Require authorization for all routes below this point
const { requireAuthorization} = require("../auth");
requireAuthorization(router);

// Set up base API routes
const { addNotFoundHandler , configureBaseApiRoutes} = require("./baseApiRouter");
configureBaseApiRoutes(router, addApiKey, getAllApiKeys, getApiKeyById, deleteApiKey);

router.post('/renew/:id', renewApiKey);

addNotFoundHandler(router);

module.exports = router;



