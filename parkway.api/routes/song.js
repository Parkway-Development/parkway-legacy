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
} = require('../controllers/songController')

//Add a song
router.post('/', addSong)

//Get all songs
router.get('/', getAllSongs)

//Get songs by title
router.get('/title/:title', getSongsByTitle)

//Get a song by id
router.get('/:id', getSongById)

//Update a song by id
router.patch('/:id', updateSongById)

//Delete a song by id
router.delete('/:id', deleteSongById)

router.use('*', (req, res) => {
    res.status(404).json({ message: 'Not Found' });
});

module.exports = router;