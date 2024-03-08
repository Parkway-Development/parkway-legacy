const mongoose = require('mongoose')
const Contribution = require('../../models/accounting/contributionModel')
const ValidationHelper = require('../../helpers/validationHelper');

//Create a new contribution
const addContribution = async (req, res) => {

    // Validate the request body is present, the profile id is present, and the profile id is valid
    if(!req.body){ return res.status(400).json({error: 'No contribution data provided.'}) }
    if(!req.body.profile){ return res.status(400).json({error: 'No profile ID provided.'}) }
    if(!ValidationHelper.validateId(req.body.profile)){ return res.status(404).json({error: 'Profile ID is not valid.'}) }
    
    // Validate the account IDs are valid and that they exist in the database
    const accountIds = req.body.accounts.map(account => account.account);
    const accountErrors = await ValidationHelper.validateAccountIds(accountIds);
    if (accountErrors) { return res.status(400).json({ errors: accountErrors }); }
    
    // Create a new contribution
    const contribution = new Contribution(req.body);
    
    // Validate the contribution
    const validationError = contribution.validateSync();
    if (validationError) { return res.status(400).json({ error: validationError.message }) }

    try {
        await contribution.save();
        return res.status(201).json(contribution);
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

//TODO: Add Date range
//TODO: Add pagination
//Get all contributions
const getAllContributions = async (req, res) => {

    try {
        const contributions = await Contribution.find({});
        if(contributions.length === 0) return res.status(200).json({ message: 'No contributions were returned.' });
        return res.status(200).json(contributions);
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

//Get contribution by ID
const getContributionById = async (req, res) => {

    if(!req.params.id){ return res.status(400).json({error: 'No Contribution ID provided.'})}
    if(!ValidationHelper.validateId(req.params.id)){ return res.status(404).json({error: 'Id is not valid.'}) }

    try {
        const contribution = await Contribution.findById(req.params.id);
        if(!contribution) return res.status(200).json({ message: 'No contribution found.' });
        return res.status(200).json(contribution);
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

//TODO: Make case insensitive
//TODO: Add Date range
//TODO: Add pagination
//Get contributions by type
const getContributionsByType = async (req, res) => {

    if(!req.params.type){ return res.status(400).json({error: 'No Contribution type provided.'})}

    try {
        const contributions = await Contribution.find({ type: req.params.type });
        if(contributions.length === 0) return res.status(200).json({ message: 'No contributions were returned.' });
        return res.status(200).json(contributions);
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

//TODO: Add Date range
//TODO: Add pagination
//Get contributions by Profile ID
const getContributionsByProfileId = async (req, res) => {

    if(!req.params.id){ return res.status(400).json({error: 'No Profile ID provided.'})}
    if(!ValidationHelper.validateId(req.params.id)){ return res.status(404).json({error: 'Id is not valid.'}) }

    try {
        const contributions = await Contribution.find({ profile: req.params.id });
        if(contributions.length === 0) return res.status(200).json({ message: 'No contributions were returned.' });
        return res.status(200).json(contributions);
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

//TODO: Add Date range
//TODO: Add pagination
//Get contributions by Account ID
const getContributionsByAccountId = async (req, res) => {

    if(!req.params.id){ return res.status(400).json({error: 'No Account ID provided.'})}
    if(!ValidationHelper.validateId(req.params.id)){ return res.status(404).json({error: 'Id is not valid.'}) }

    try {
        const contributions = await Contribution.find({ 'accounts.account': req.params.id });
        if(contributions.length === 0) return res.status(200).json({ message: 'No contributions were returned.' });
        return res.status(200).json(contributions);
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

//Update a contribution by ID
const updateContribution = async (req, res) => {

    if(!req.params.id){ return res.status(400).json({error: 'No Contribution ID provided.'})}
    if(!ValidationHelper.validateId(req.params.id)){ return res.status(404).json({error: 'Id is not valid.'}) }

    try {
        let contribution = await Contribution.findByIdAndUpdate({ _id: req.params.id }, { ...req.body }, { new: true, runValidators: true});
        if(!contribution) return res.status(404).json({error: "Update failed."});
        return res.status(200).json(contribution);
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

//Delete an asset by ID
const deleteContribution = async (req, res) => {

    if(!req.params.id){ return res.status(400).json({error: 'No Contribution ID provided.'})}
    if(!ValidationHelper.validateId(req.params.id)){ return res.status(404).json({error: 'Id is not valid.'}) }

    try {
        const contribution = await Contribution.findByIdAndDelete(req.params.id);
        if(!contribution){ return res.status(404).json({message: "Contribution could not be found.  Contribution was not deleted."})};
        return res.status(200).json({message: "Contribution deleted", contribution: contribution});
    } catch (error) {
        return res.status(500).json(error.message);
    }
}


module.exports = {
    addContribution,
    getAllContributions,
    getContributionById,
    getContributionsByType,
    getContributionsByProfileId,
    getContributionsByAccountId,
    updateContribution,
    deleteContribution
}