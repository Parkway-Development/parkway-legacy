const express = require('express');
const router = express.Router();

//controller functions
const {
    signupUser, 
    loginUser,
    getAll, 
    getById,
    getByEmail,
    addApplicationClaim,
    signupWixUser
} = require('../controllers/userController');

const { addNotFoundHandler } = require("./baseApiRouter");

//login route
router.post('/login', loginUser)

//connect (or signup) route
router.post('/connect', signupUser)

//Wix connect route
router.post('/wixconnect', signupWixUser)

// const { requireAuthorization } = require("../middleware/auth");
// requireAuthorization(router);

const { requireAppAndKeyValidation } = require('../middleware/validateApiKey');
requireAppAndKeyValidation(router);

//get all users
router.get('/', getAll)

//get user by id
router.get('/:id', getById)

//get user by email
router.get('/email/:email', getByEmail)

//add application claim to user
router.patch('/:id/applicationclaim', addApplicationClaim)

addNotFoundHandler(router);

module.exports = router;