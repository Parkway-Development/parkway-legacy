//setup Mongoose
const mongoose = require('mongoose');
//import the necessary models
const Pledge = require('../models/pledgeModel');


//Post a pledge
const addPledge = async (req, res) => {
    const pledge = new Pledge({
        amount: req.body.amount,
        date: req.body.date,
        type: req.body.type,
        fund: req.body.fund,
        profileId: req.body.profileId
    })

    const pledgeToSave = await pledge.save();

    if(!pledgeToSave){
    return res.status(404).json({mssg: "The save failed."})}

    res.status(200).json(pledgeToSave)
}

//Get all pledges
const getAllPledges = async (req, res) => {
    const pledges = await Pledge.find({}).sort({date: -1});
    if(!pledges){
        return res.status(404).json({mssg: "No pledges were returned."})
    }
    res.status(200).json(pledges)
}

//Get pledge by ID
const getPledgeById = async (req, res) => {

    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such pledge.'})
    }
    const pledge = await Pledge.findById(id);

    if(!pledge){
        return res.status(404).json({mssg: "No such pledge found."})
    }
        
    res.status(200).json(pledge)
}

//Get pledges by profile
const getPledgesByProfile = async (req, res) => {
    const pledges = await Pledge.find({profileId: req.params.id}).sort({date: -1});
    if(!pledges){
        return res.status(404).json({mssg: "No pledges found."})
    }
    res.status(200).json(pledges)
}

//Update a pledge by ID
const updatePledge = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such pledge.'})
    }

    const pledge = await Pledge.findById(id);

    if(!pledge){
        return res.status(404).json({mssg: "No such pledge found."})
    }

    const updatedPledge = await Pledge.findByIdAndUpdate(id, req.body, {new: true});

    if(!updatedPledge){
        return res.status(404).json({mssg: "The update failed."})
    }
    res.status(200).json(updatedPledge)
}

//Delete a pledge by ID
const deletePledge = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such pledge.'})
    }

    const pledge = await Pledge.findById(id);

    if(!pledge){
        return res.status(404).json({mssg: "No such pledge found."})
    }

    const deletedPledge = await Pledge.findByIdAndDelete(id);

    if(!deletedPledge){
        return res.status(404).json({mssg: "The delete failed."})
    }
    res.status(200).json(deletedPledge)
}

module.exports = {
    addPledge,
    getAllPledges,
    getPledgeById,
    getPledgesByProfile,
    updatePledge,
    deletePledge,
}