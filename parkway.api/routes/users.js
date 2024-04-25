const express = require('express');
const router = express.Router();
const {
    signupUser, 
    loginUser,
    getAll, 
    getById,
    getByEmail,
    addApplicationClaim,
    signupWixUser
} = require('../controllers/userController');

router.post('/login', loginUser)
router.post('/connect', signupUser)
router.post('/wixconnect', signupWixUser)

const { addNotFoundHandler } = require("./baseApiRouter");
const { requireAppAndKeyValidation } = require('../middleware/validateApiKey');
const { requireAuthorization} = require("../middleware/auth");
requireAuthorization(router);
requireAppAndKeyValidation(router);
addNotFoundHandler(router);

router.get('/', getAll)
router.get('/:id', getById)
router.get('/email/:email', getByEmail)
router.patch('/:id/applicationclaim', addApplicationClaim)

module.exports = router;