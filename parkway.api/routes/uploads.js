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
const { addNotFoundHandler, configureBaseApiRoutes } = require("./baseApiRouter");

// Add your routes here
router.post('/subsplash', upload.single('file'), uploadSubsplashTransferFile);

addNotFoundHandler(router);
module.exports = router;
