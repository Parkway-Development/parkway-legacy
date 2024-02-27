const express = require('express');
const router = express.Router();

//controller functions
const { password } = require('../controllers/settingController');

//password route
router.get('/password', password);

module.exports = router;