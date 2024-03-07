const mongoose = require('mongoose');
const Donations = require('../models/donationModel');

//Post a donation
const addDonation = async (req, res) => {
    const donation = new Donations(req.body);

    const validationError = donation.validateSync();
    if(validationError){
        return res.status(400).json({message: validationError.message})
    }
//TODO: Review what is happening here
    try{
        await donation.save();
        return res.status(201).json(donationToSave);
    }
    catch (error){
        return res.status(500).json({message: error.message})
    }
}

//Get all donations
const getAllDonations = async (req, res) => {
    const donations = await Donations.find({}).sort({date: -1});
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
    const donation = await Donations.findById(id);

    if(!donation){
        return res.status(404).json({message: "No such donation found."})
    }
        
    res.status(200).json(donation)
}

//Get donations by profile
const getDonationsByProfile = async (req, res) => {
    const donations = await Donations.find({profile: req.params.id}).sort({date: -1});
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

    const donation = await Donations.findById(id);

    if(!donation){
        return res.status(404).json({message: "No such donation found."})
    }

    const deletedDonation = await Donations.findByIdAndDelete(id);

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