const express = require('express');
const router = express.Router();
const { password } = require('../controllers/settingController');

const { addNotFoundHandler, configureBaseApiRoutes } = require('./baseApiRouter');

//add additional routes here
router.get('/password', password);

addNotFoundHandler(router);
module.exports = router;