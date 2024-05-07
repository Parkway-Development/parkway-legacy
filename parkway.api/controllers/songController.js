const mongoose = require('mongoose')
const Song = require('../models/songModel')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Temporary storage


const addSong = async (req, res) => {
    try {
        const song = new Song(req.body);
        if (!song) { throw new Error("Please provide a song.") }

        const savedSong = await song.save();
        if(!savedSong){ throw new Error("The save failed.") }

        return res.status(201).json(savedSong)
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}

const getAllSongs = async (req, res) => {
    try {
        const songs = await Song.find({})
        if(!songs){ throw new Error("No songs were returned.") }

        return res.status(200).json(songs)
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}

const getSongsByTitle = async (req, res) => {
    try {
        const { title } = req.params;
        if (!title) { throw new Error("Please provide a title.") }

        const songs = await Song.find({ title: title })
        if(songs.length === 0){ throw new Error("No songs were returned.") }

        return res.status(200).json(songs)
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}

const getSongById = async (req, res) => {
    try {
        const { id } = req.params;
        if(!id) {throw new Error("Please provide an id.")}
        if(!mongoose.Types.ObjectId.isValid(id)){ throw new Error("Invalid id.") }

        const song = await Song.findById(id)
        if(!song){ throw new Error("No song was found with that id.") }

        return res.status(200).json(song)
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}

const updateSongById = async (req, res) => {
    try {
        const { id } = req.params;
        if(!id) {throw new Error("Please provide an id.")}
        if(!mongoose.Types.ObjectId.isValid(id)){ throw new Error("Invalid id.") }

        const song = await Song.findByIdAndUpdate(id, req.body, { new: true })
        if(!song){ throw new Error("No song was found with that id.") }

        return res.status(200).json(song)
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}

const deleteSongById = async (req, res) => {
    try {
        const { id } = req.params;
        if(!id) {throw new Error("Please provide an id.")}
        if(!mongoose.Types.ObjectId.isValid(id)){ throw new Error("Invalid id.") }
        
        const song = await Song.findByIdAndDelete(id)
        if(!song){ throw new Error("No song was found with that id.") }

        return res.status(200).json(song)
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}

module.exports = { 
    addSong,
    getAllSongs,
    getSongsByTitle,
    getSongById,
    updateSongById,
    deleteSongById
}
