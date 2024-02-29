const mongoose = require('mongoose');
const Donation = require('../models/donationModel');

//Post a donation
const addDonation = async (req, res) => {
    const donation = new Donation(req.body);
    const donationToSave = await donation.save();

    if(!donationToSave){
    return res.status(404).json({message: "The save failed."})}

    res.status(200).json(donationToSave)
}

//Get all donations
const getAllDonations = async (req, res) => {
    const donations = await Donation.find({}).sort({date: -1});
    if(!donations){
        return res.status(404).json({message: "No donations were returned."})
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
        return res.status(404).json({message: "No such donation found."})
    }
        
    res.status(200).json(donation)
}

//Get donations by profile
const getDonationsByProfile = async (req, res) => {
    const donations = await Donation.find({profileId: req.params.id}).sort({date: -1});
    if(!donations){
        return res.status(404).json({message: "No donations found."})
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
        return res.status(404).json({message: "No such donation found."})
    }

    const updatedDonation = await Donation.findByIdAndUpdate(id, req.body, {new: true});

    if(!updatedDonation){
        return res.status(404).json({message: "The update failed."})
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
        return res.status(404).json({message: "No such donation found."})
    }

    const deletedDonation = await Donation.findByIdAndDelete(id);

    if(!deletedDonation){
        return res.status(404).json({message: "The delete failed."})
    }
    res.status(200).json(deletedDonation)
}

module.exports = {
    addDonation,
    getAllDonations,
    getDonationById,
    getDonationsByProfile,
    updateDonation,
    deleteDonation
}