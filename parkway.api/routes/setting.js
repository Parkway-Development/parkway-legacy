const express = require('express');
const router = express.Router();

//controller functions
const { password } = require('../controllers/settingController');

//password route
router.get('/password', password);

router.use('*', (req, res) => {
    res.status(404).json({ message: 'Not Found' });
});

module.exports = router;