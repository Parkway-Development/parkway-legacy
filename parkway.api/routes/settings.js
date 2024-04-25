const express = require('express');
const router = express.Router();
const { password } = require('../controllers/settingController');

const { addNotFoundHandler, configureBaseApiRoutes } = require('./baseApiRouter');
const { requireAppAndKeyValidation } = require('../middleware/validateApiKey');
const { requireAuthorization} = require("../middleware/auth");
requireAuthorization(router);
requireAppAndKeyValidation(router);
addNotFoundHandler(router);

//password route
router.get('/password', password);

addNotFoundHandler(router);

module.exports = router;