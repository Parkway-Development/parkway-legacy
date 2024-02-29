const mongoose = require('mongoose');
const Donation = require('../models/donationModel');

//Donations
//Post a donation
const addDonation = async (req, res) => {
    const donation = new Donation({
        amount: req.body.amount,
        date: req.body.date,
        type: req.body.type,
        fund: req.body.fund,
        profileId: req.body.profileId
    })

    const donationToSave = await donation.save();

    if(!donationToSave){
    return res.status(404).json({mssg: "The save failed."})}

    res.status(200).json(donationToSave)
}

//Get all donations
const getAllDonations = async (req, res) => {
    const donations = await Donation.find({}).sort({date: -1});
    if(!donations){
        return res.status(404).json({mssg: "No donations were returned."})
    }
    res.status(200).json(donations)
}

//Get donation by ID
const getDonationById = async (req, res) => {

    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such donation.'})
    }
    const donation = await Donation.findById(id);

    if(!donation){
        return res.status(404).json({mssg: "No such donation found."})
    }
        
    res.status(200).json(donation)
}

//Get donations by profile
const getDonationsByProfile = async (req, res) => {
    const donations = await Donation.find({profileId: req.params.id}).sort({date: -1});
    if(!donations){
        return res.status(404).json({mssg: "No donations found."})
    }
    res.status(200).json(donations)
}

//Update a donation by ID
const updateDonation = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such donation.'})
    }

    const donation = await Donation.findById(id);

    if(!donation){
        return res.status(404).json({mssg: "No such donation found."})
    }

    const updatedDonation = await Donation.findByIdAndUpdate(id, req.body, {new: true});

    if(!updatedDonation){
        return res.status(404).json({mssg: "The update failed."})
    }
    res.status(200).json(updatedDonation)
}

//Delete a donation by ID
const deleteDonation = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such donation.'})
    }

    const donation = await Donation.findById(id);

    if(!donation){
        return res.status(404).json({mssg: "No such donation found."})
    }

    const deletedDonation = await Donation.findByIdAndDelete(id);

    if(!deletedDonation){
        return res.status(404).json({mssg: "The delete failed."})
    }
    res.status(200).json(deletedDonation)
}

//Pledges
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
    addDonation,
    getAllDonations,
    getDonationById,
    getDonationsByProfile,
    updateDonation,
    deleteDonation,
    addPledge,
    getAllPledges,
    getPledgeById,
    getPledgesByProfile,
    updatePledge,
    deletePledge
}