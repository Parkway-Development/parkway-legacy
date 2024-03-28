const express = require('express');
const router = express.Router();

//controller functions
const {
    signupUser, 
    loginUser,
    getAll, 
    getById,
    getByEmail,
    signupWixUser
} = require('../controllers/userController');

const { addNotFoundHandler} = require("./baseApiRouter");

//login route
router.post('/login', loginUser)

//connect (or signup) route
router.post('/connect', signupUser)

//Wix connect route
router.post('/wixconnect', signupWixUser)

const { requireAuthorization } = require("../middleware/auth");
requireAuthorization(router);

//get all users
router.get('/', getAll)

//get user by id
router.get('/:id', getById)

//get user by email
router.get('/email/:email', getByEmail)

addNotFoundHandler(router);

module.exports = router;