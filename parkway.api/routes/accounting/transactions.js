const express = require('express');
const router = express.Router();

const { addNotFoundHandler } = require("../baseApiRouter");

// const { requireAuthorization} = require("../../middleware/auth");
// requireAuthorization(router);
const { requireAppAndKeyValidation } = require('../../middleware/validateApiKey');
requireAppAndKeyValidation(router);

addNotFoundHandler(router);

const { requireAuthorization} = require("../../middleware/auth");
requireAuthorization(router);

module.exports = router;