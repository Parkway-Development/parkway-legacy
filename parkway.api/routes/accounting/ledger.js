const express = require('express');
const router = express.Router();

const { addNotFoundHandler, configureBaseApiRoutes } = require('../baseApiRouter');


//add additional routes here

addNotFoundHandler(router);
module.exports = router;