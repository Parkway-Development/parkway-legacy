const mongoose = require('mongoose');
const Donations = require('../../models/accounting/donationModel');
const ValidationHelper = require('../../helpers/validationHelper');

//Post a donation
const addDonation = async (req, res) => {

    const donation = new Donations(req.body);

    const validationError = donation.validateSync();
    if(validationError){ return res.status(400).json( validationError.message ) }

    try{
        await donation.save();
        return res.status(201).json(donation);
    }
    catch (error){
        return res.status(500).json(error.message)
    }
}

//Get all donations
const getAllDonations = async (req, res) => {

    try{
        const donations = await Donations.find({}).sort({date: -1});
        if(!donations){ return res.status(200).json({message: "No donations were returned."}) }
        return res.status(200).json(donations)
    } catch (error){
        return res.status(500).json(error.message)
    }
}

//Get donation by ID
const getDonationById = async (req, res) => {

    if(!req.params.id){ return res.status(400).json({error: 'No Account ID provided.'})}
    if(!ValidationHelper.validateId(req.params.id)){ return res.status(404).json({error: 'Id is not valid.'}) }

    try{
        const donation = await Donations.findById( req.params.id );
        if(!donation){ return res.status(200).json({message: "No donation found."}) }
        return res.status(200).json(donation)
    } catch (error){
        return res.status(500).json(error.message)
    }
}

//Get donations by profile
const getDonationsByProfile = async (req, res) => {

    if(!req.params.id){ return res.status(400).json({error: 'No Profile ID provided.'})}
    if(!ValidationHelper.validateId(req.params.id)){ return res.status(404).json({error: 'Id is not valid.'}) }

    try{
        const donations = await Donations.find({profile: req.params.id}).sort({date: -1});
        if(donations.length === 0){ return res.status(200).json({message: "No donations found."}) }
        return res.status(200).json(donations)
    } catch (error){
        return res.status(500).json(error.message)
    }
}

//Update a donation by ID
const updateDonation = async (req, res) => {

    if(!req.params.id){ return res.status(400).json({error: 'No Donation ID provided.'})}
    if(!ValidationHelper.validateId(req.params.id)){ return res.status(404).json({error: 'Id is not valid.'}) }

    try{
        let donation = await Donations.findByIdAndUpdate({ _id: id }, { ...req.body }, { new: true, runValidators: true});
        if(!donation){ return res.status(404).json({error: "The update failed."}) }
        return res.status(200).json(donation);
    }
    catch (error){
        return res.status(500).json(error.message)
    }
}

//Delete a donation by ID
const deleteDonation = async (req, res) => {

    if(!req.params.id){ return res.status(400).json({error: 'No Donation ID provided.'})}
    if(!ValidationHelper.validateId(req.params.id)){ return res.status(404).json({error: 'Id is not valid.'}) }

    try{
        const donation = await Donations.findByIdAndDelete(req.params.id);
        if(!donation){ return res.status(404).json({message: "Donation could not be found.  Donation was not deleted."}) }
        return res.status(200).json({message: 'Donation ' + donation._id + ' was deleted.', donation: donation});
    } catch (error){
        return res.status(500).json(error.message)
    }
}

module.exports = {
    addDonation,
    getAllDonations,
    getDonationById,
    getDonationsByProfile,
    updateDonation,
    deleteDonation
}