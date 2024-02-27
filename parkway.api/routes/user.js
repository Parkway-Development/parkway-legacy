const express = require('express');
const router = express.Router();

//controller functions
const {
    signupUser, 
    loginUser, 
    getAll} = require('../controllers/userController');

//login route
router.post('/login', loginUser)

//connect (or signup) route
router.post('/connect', signupUser)

//get all users
router.get('/', getAll)

module.exports = router;