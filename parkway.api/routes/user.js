const express = require('express');
const router = express.Router();

//controller functions
const {
    signupUser, 
    loginUser} = require('../controllers/userController');

const { requireAuthorization } = require("../auth");

//login route
router.post('/login', loginUser)

//connect (or signup) route
router.post('/connect', signupUser)

module.exports = router;