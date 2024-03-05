const express = require('express');
const {

} = require('../controllers/platformController')
const { requireAuthorization} = require("../auth");
const router = express.Router();
requireAuthorization(router);



router.use('*', (req, res) => {
    res.status(404).json({ message: 'Not Found' });
});

module.exports = router;