const express = require('express');
const router = express.Router();
const {
    uploadSubsplashTransferFile
} = require('../controllers/uploadController');
const Multer = require('multer');

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


// const { requireAuthorization} = require("../../middleware/auth");
// requireAuthorization(router);
const { requireAppAndKeyValidation } = require('../middleware/validateApiKey');
requireAppAndKeyValidation(router);

// Upload a CSV File
router.post('/subsplash', upload.single('file'), uploadSubsplashTransferFile);

// Export the router
module.exports = router;
