const express = require('express');
const router = express.Router();

const { addNotFoundHandler } = require("../baseApiRouter");

addNotFoundHandler(router);

const { requireAuthorization} = require("../../middleware/auth");
requireAuthorization(router);

module.exports = router;