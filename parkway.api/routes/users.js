const express = require('express');
const router = express.Router();
const {
    requestPasswordReset,
    passwordReset,
    signupUser, 
    loginUser,
    getAllUsers, 
    getUserById,
    getUserByEmail,
    addApplicationClaimToUser
} = require('../controllers/userController');
const { addNotFoundHandler } = require("./baseApiRouter");
const { authenticateToken } = require('../middleware/auth');
const { requireSpecOpsClaim } = require('../middleware/claimsValidation');

router.post('/login', loginUser)
router.post('/connect', signupUser)
router.post('/requestpasswordreset', requestPasswordReset)
router.post('/passwordreset', passwordReset)

router.use(authenticateToken, requireSpecOpsClaim)
router.get('/', getAllUsers)
router.get('/:id', getUserById)
router.get('/email/:email', getUserByEmail)
router.patch('/:id/applicationclaim', addApplicationClaimToUser)

addNotFoundHandler(router);
module.exports = router;