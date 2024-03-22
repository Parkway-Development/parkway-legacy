const express = require('express');
const { requireAuthorization} = require("../auth");
const router = express.Router();
requireAuthorization(router);

const {
    addSong,
    getAllSongs,
    getSongsByTitle,
    getSongById,
    updateSongById,
    deleteSongById
} = require('../controllers/songController');

const { addNotFoundHandler, configureBaseApiRoutes } = require("./baseApiRouter");

configureBaseApiRoutes(router, addSong, getAllSongs, getSongById, updateSongById, deleteSongById);

//Get songs by title
router.get('/title/:title', getSongsByTitle);

addNotFoundHandler(router);

module.exports = router;