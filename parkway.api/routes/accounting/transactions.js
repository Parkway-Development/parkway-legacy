const express = require('express');
const { requireAuthorization} = require("../../auth");
const router = express.Router();
requireAuthorization(router);

const { addNotFoundHandler } = require("../baseApiRouter");

addNotFoundHandler(router);

module.exports = router;