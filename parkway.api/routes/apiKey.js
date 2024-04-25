const express = require('express');
const{
    addApiKey,
    getAllApiKeys,
    getApiKeyById,
    deleteApiKey,
    renewApiKey
} = require('../controllers/apiKeyController');

const { addNotFoundHandler } = require("../baseApiRouter");
const { requireAppAndKeyValidation } = require('../middleware/validateApiKey');
const { requireAuthorization} = require("../middleware/auth");
requireAuthorization(router);
requireAppAndKeyValidation(router);
addNotFoundHandler(router);
configureBaseApiRoutes(router, addApiKey, getAllApiKeys, getApiKeyById, deleteApiKey);

router.post('/renew/:id', renewApiKey);

module.exports = router;



