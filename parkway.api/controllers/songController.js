const mongoose = require('mongoose')
const Song = require('../models/songModel')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Temporary storage


//Add a song
const addSong = async (req, res) => {
    try {
        const song = await Song.save(req.body)
        if(!song){
            return res.status(404).json({message: "The save failed."})
        }   
        return res.status(201).json(newSong)
    } catch (error) {
        res.status(400).json({ message: error })
    }
}

//Get all songs
const getAllSongs = async (req, res) => {
    try {
        const songs = await Song.find({})
        if(!songs){
            return res.status(404).json({message: "No songs were found."})
        }
        return res.status(200).json(songs)
    }
    catch (error) {
        res.status(400).json({ message: error })
    }
}

//Get a song by title
const getSongsByTitle = async (req, res) => {
    try {
        const { title } = req.params;
        const songs = await Song.find({ title: title })
        if(songs.length === 0){
            return res.status(404).json({message: "No songs found."})
        }
        return res.status(200).json(songs)
    }
    catch (error) {
        res.status(400).json({ message: error })
    }
}

//Get a song by id
const getSongById = async (req, res) => {
    try {
        const { id } = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).json({error: 'No such song.'})
        }
        const song = await Song.findById(id)
        if(!song){
            return res.status(404).json({message: "No such song found."})
        }
        return res.status(200).json(song)
    }
    catch (error) {
        res.status(400).json({ message: error })
    }
}

//Update a song by id
const updateSongById = async (req, res) => {
    try {
        const { id } = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).json({error: 'No such song.'})
        }
        const song = await Song.findByIdAndUpdate(id, req.body, { new: true })
        if(!song){
            return res.status(404).json({message: "No such song found."})
        }
        return res.status(200).json(song)
    }
    catch (error) {
        res.status(400).json({ message: error })
    }
}

//Delete a song by id
const deleteSongById = async (req, res) => {
    try {
        const { id } = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).json({error: 'No such song.'})
        }
        const song = await Song.findByIdAndRemove(id)
        if(!song){
            return res.status(404).json({message: "No such song found."})
        }
        return res.status(200).json(song)
    }
    catch (error) {
        res.status(400).json({ message: error })
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
