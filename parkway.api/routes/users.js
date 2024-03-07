const express = require('express');
const router = express.Router();

//controller functions
const {
    signupUser, 
    loginUser,
    getAll, 
    getById,
    getByEmail
} = require('../controllers/userController');

//login route
router.post('/login', loginUser)

//connect (or signup) route
router.post('/connect', signupUser)

const { requireAuthorization } = require("../auth");

//get all users
router.get('/', getAll)

//get user by id
router.get('/:id', getById)

//get user by email
router.get('/email/:email', getByEmail)

router.use('*', (req, res) => {
    res.status(404).json({ message: 'Not Found' });
});

module.exports = router;