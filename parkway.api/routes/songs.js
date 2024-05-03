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

configureBaseApiRoutes(router, addSong, getAllSongs, getSongById, updateSongById, deleteSongById);

//add additional routes here
router.get('/title/:title', getSongsByTitle);

addNotFoundHandler(router);
module.exports = router;