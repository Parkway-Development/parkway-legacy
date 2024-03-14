const express = require('express');
const Multer = require('multer');
const { requireAuthorization } = require("../auth");
const router = express.Router();
requireAuthorization(router);

// Initialize Multer storage settings
const storage = Multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); // Make sure this uploads directory exists
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    }
});

// Initialize upload middleware
const upload = Multer({ storage: storage });

const {
    uploadSubsplashTransferFile
} = require('../controllers/uploadController');

// Upload a CSV File
router.post('/subsplash', upload.single('file'), uploadSubsplashTransferFile);

// Export the router
module.exports = router;
