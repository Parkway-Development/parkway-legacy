const express = require('express');
const{
    addApiKey,
    getAllApiKeys,
    getApiKeyById,
    deleteApiKey,
    renewApiKey
} = require('../controllers/apiKeyController');
const { addNotFoundHandler } = require("../baseApiRouter");

configureBaseApiRoutes(router, addApiKey, getAllApiKeys, getApiKeyById, deleteApiKey);

//add additional routes here
router.post('/renew/:id', renewApiKey);

addNotFoundHandler(router);
module.exports = router;



