const express = require('express');
const router = express.Router();
const {
    requestPasswordReset,
    passwordReset,
    signupUser, 
    loginUser,
    signupWixUser,
    getAll, 
    getById,
    getByEmail,
    addApplicationClaim
} = require('../controllers/userController');
const { addNotFoundHandler } = require("./baseApiRouter");
const { authenticateToken } = require('../middleware/auth');
const { requireSpecOpsClaim } = require('../middleware/claimsValidation');

router.post('/login', loginUser)
router.post('/connect', signupUser)
router.post('/wixconnect', signupWixUser)
router.post('/requestpasswordreset', requestPasswordReset)
router.post('/passwordreset', passwordReset)

router.use(authenticateToken)
router.get('/', getAll)
router.get('/:id', getById)
router.get('/email/:email', getByEmail)
router.patch('/:id/applicationclaim', addApplicationClaim)

addNotFoundHandler(router);
module.exports = router;