const express = require('express');
const router = express.Router();

//controller functions
const { password } = require('../controllers/settingController');
const { addNotFoundHandler } = require("./baseApiRouter");

//password route
router.get('/password', password);

addNotFoundHandler(router);

module.exports = router;