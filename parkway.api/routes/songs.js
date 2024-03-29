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

const { requireAuthorization} = require("../middleware/auth");
requireAuthorization(router);

configureBaseApiRoutes(router, addSong, getAllSongs, getSongById, updateSongById, deleteSongById);

//Get songs by title
router.get('/title/:title', getSongsByTitle);

addNotFoundHandler(router);

module.exports = router;