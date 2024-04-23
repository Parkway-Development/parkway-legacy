const express = require('express');
const router = express.Router();
const {
    addSong,
    getAllSongs,
    getSongsByTitle,
    getSongById,
    updateSongById,
    deleteSongById
} = require('../controllers/songController');

const { addNotFoundHandler, configureBaseApiRoutes } = require("./baseApiRouter");

// const { requireAuthorization} = require("../../middleware/auth");
// requireAuthorization(router);
const { requireAppAndKeyValidation } = require('../middleware/validateApiKey');
requireAppAndKeyValidation(router);
configureBaseApiRoutes(router, addSong, getAllSongs, getSongById, updateSongById, deleteSongById);

const { requireAuthorization} = require("../middleware/auth");
requireAuthorization(router);

//Get songs by title
router.get('/title/:title', getSongsByTitle);

addNotFoundHandler(router);

module.exports = router;