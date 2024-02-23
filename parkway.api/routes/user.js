const express = require('express');

//controller functions
const {signupUser, loginUser} = require('../controllers/userController');
const router = express.Router();

//login route
router.post('/login', loginUser)

//connect (or signup) route
router.post('/connect', signupUser)

module.exports = router;