const mongoose = require('mongoose');
const Team = require('../models/teamModel');

//Post a team
const addTeam = async (req, res) => {
    const team = new Team({
        name: req.body.name,
        description: req.body.description,
        leaderId: req.body.leaderId,
        members: req.body.members
    })

    const teamToSave = await team.save();

    if(!teamToSave){
    return res.status(404).json({mssg: "The save failed."})}

    res.status(200).json(teamToSave)
}

//Get all teams
const getAll = async (req, res) => {
    const teams = await Team.find({}).sort({teamName: 1});
    if(!teams){
        return res.status(404).json({mssg: "No teams were returned."})
    }
    res.status(200).json(teams)
}

//Get Team by ID
const getById = async (req, res) => {

    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such team.'})
    }
    const team = await Team.findById(id);

    if(!team){
        return res.status(404).json({mssg: "No such team found."})
    }
        
    res.status(200).json(team)
}

//Get team by team name
const getByName = async (req, res) => {
    const teams = await Team.find({teamName: req.params.teamName});
    if(!teams){
        return res.status(404).json({mssg: "No teams found."})
    }
    res.status(200).json(teams)
}

//Update team by ID
const updateTeam = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such team.'})
    }
    const updatedTeam = await Team.findByIdAndUpdate(id, req.body, {new: true});

    if(!updatedTeam){
        return res.status(404).json({mssg: "No such team found."})
    }
    res.status(200).json(updatedTeam)
}

//Delete team by ID
const deleteTeam = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such team.'})
    }
    const deletedTeam = await Team.findByIdAndDelete(id);

    if(!deletedTeam){
        return res.status(404).json({mssg: "No such team found."})
    }
    res.status(200).json(deletedTeam)
}

module.exports = {
    addTeam,
    getAll,
    getById,
    getByName,
    updateTeam,
    deleteTeam
}