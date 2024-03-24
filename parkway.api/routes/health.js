const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {

    const dbState = mongoose.connection.readyState;
    if(dbState === 1) {
        res.status(200).json({ databaseStatus: 'Connected', apiStatus: 'Healthy' });
    } else {
        // Respond with a server error status code if not connected
        res.status(500).json({ message: 'Internal Server Error', dbStatus: 'Disconnected' });
    }
});



module.exports = router;