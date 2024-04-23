const express = require('express');
const{
    addApiKey,
    getAllApiKeys,
    getApiKeyById,
    deleteApiKey,
    renewApiKey
} = require('../controllers/apiKeyController');

const { addNotFoundHandler , configureBaseApiRoutes} = require("./baseApiRouter");

const { requireAuthorization} = require("../auth");

const router = express.Router();

requireAuthorization(router);

configureBaseApiRoutes(router, addApiKey, getAllApiKeys, getApiKeyById, deleteApiKey);

router.post('/renew/:id', renewApiKey);

addNotFoundHandler(router);

module.exports = router;



