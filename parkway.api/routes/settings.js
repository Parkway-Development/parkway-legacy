const express = require('express');
const router = express.Router();
const { password } = require('../controllers/settingController');

const { addNotFoundHandler } = require("./baseApiRouter");

// const { requireAuthorization} = require("../../middleware/auth");
// requireAuthorization(router);
const { requireAppAndKeyValidation } = require('../middleware/validateApiKey');
requireAppAndKeyValidation(router);

//password route
router.get('/password', password);

addNotFoundHandler(router);

module.exports = router;