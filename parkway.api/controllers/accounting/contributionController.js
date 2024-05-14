const mongoose = require('mongoose')
const Contribution = require('../../models/accounting/contributionModel')
const ValidationHelper = require('../../helpers/validationHelper');
//const AccountValidation = require('../../helpers/userValidation');
const UserValidation = require('../../helpers/userValidation');
const Deposit = require('../../models/accounting/depositModel');
//const Profile = require('../../models/profileModel');

const addContribution = async (req, res) => {


    try {
        if(!req.body){throw new Error('No contribution data provided.')};

        if(req.body.profile){
            if (!mongoose.Types.ObjectId.isValid(req.body.profile)) { throw new Error("Invalid ID.")}
            if(!await UserValidation.profileExists(req.body.profile)){throw new Error('A Profile Id was provided but that profile could not be found.')}
        }

        if (!req.body.accounts || req.body.accounts.length === 0){
            let generalFund = await Account.findOne({name: 'General Fund'});
            if(!generalFund){
                generalFund = new Account({name: 'General Fund', type: 'Fund'});
            }
        }

        const accountIds = req.body.accounts.map(account => account.account);
        const accountErrors = await ValidationHelper.validateAccountIds(accountIds);
        if (accountErrors) { throw new Error(accountErrors ); }
    
        const contribution = new Contribution(req.body);

        const validationError = contribution.validateSync();

        if (validationError) { throw new Error(validationError.message) }

        await contribution.save({new: true});

        if(req.body.depositId){
            if (!mongoose.Types.ObjectId.isValid(req.body.depositId)) { throw new Error("Invalid ID.")}
            const deposit = await Deposit.findById(req.body.depositId);
            if(!deposit){throw new Error('A Deposit Id was provided but that deposit could not be found.')}

            deposit.contributions.push(contribution._id);
            await deposit.save();
        }        

        return res.status(201).json(contribution);

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: error.message});
    }
}

//TODO: Add Date range
//TODO: Add pagination
const getAllContributions = async (req, res) => {

    try {
        const contributions = await Contribution.find({});
        if(contributions.length === 0) { throw new Error('No contributions were returned.')}
        return res.status(200).json(contributions);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json(error.message);
    }
}

const getContributionById = async (req, res) => {
    try {
        if(!req.params.id){ throw new Error('No Contribution ID provided.')}
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){ throw new Error('Invalid ID.')}

        const contribution = await Contribution.findById(req.params.id);
        if(!contribution) {throw new Error('Contribution not found.')};

        return res.status(200).json(contribution);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json(error.message);
    }
}

//TODO: Make case insensitive
//TODO: Add Date range
//TODO: Add pagination
const getContributionsByType = async (req, res) => {
    try {
        if(!req.params.type){ throw new Error('No Contribution type provided.')}

        const contributions = await Contribution.find({ type: req.params.type });
        if(contributions.length === 0) throw new Error('No contributions were returned.');
        return res.status(200).json(contributions);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json(error.message);
    }
}

//TODO: Add Date range
//TODO: Add pagination
const getContributionsByProfileId = async (req, res) => {
    try {

        if(!req.params.id){ throw new Error('No Profile ID provided.')}
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){ throw new Error('Invalid ID.')}

        const contributions = await Contribution.find({ profile: req.params.id });
        if(contributions.length === 0) { throw new Error('No contributions were returned.')}
        return res.status(200).json(contributions);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json(error.message);
    }
}

//TODO: Add Date range
//TODO: Add pagination
const getContributionsByAccountId = async (req, res) => {
    try {
        if(!req.params.id){ throw new Error('No Account ID provided.')}
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){ throw new Error('Invalid ID.')}

        const contributions = await Contribution.find({ 'accounts.account': req.params.id });
        if(contributions.length === 0) return res.status(200).json({ message: 'No contributions were returned.' });
        return res.status(200).json(contributions);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json(error.message);
    }
}

const updateContribution = async (req, res) => {
    try {
        if(!req.params.id){ throw new Error('No Contribution ID provided.')}
        if (!req.body || Object.keys(req.body).length === 0) { throw new Error('No contribution updates provided.  The request body either did not contain an object, or the object did not have any keys.') }
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){ throw new Error('Invalid ID.')}

        //Get the contribution in question
        const contribution = await Contribution.findById(req.params.id);
        if(!contribution){ return res.status(404).json({error: 'Contribution not found.'}) }

        // Apply updates dynamically
        Object.keys(req.body).forEach(key => {
            contribution[key] = req.body[key];
        });
        
        const validationError = contribution.validateSync();
        if (validationError) { throw new Error({ error: validationError.message }) }
        
        //Do the update
        const updatedContribution = await contribution.save();
        if(!updatedContribution) throw new Error('Contribution could not be updated.');

        return res.status(200).json(updatedContribution);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json(error.message);
    }
}

//TODO:  Adjust the ledger before removing the contribution
const deleteContribution = async (req, res) => {

    if(!req.params.id){ return res.status(400).json({error: 'No Contribution ID provided.'})}
    if(!ValidationHelper.validateId(req.params.id)){ return res.status(404).json({error: 'Id is not valid.'}) }

    try {
        const contribution = await Contribution.findByIdAndDelete(req.params.id);
        if(!contribution){ return res.status(404).json({message: "Contribution could not be found.  Contribution was not deleted."})};
        if(contribution.depositDate){ return res.status(200).json({message: 'This contribution has already been deposited and cannot be deleted.  You may only assign it to another profile or change the distribution between accounts.'}) }

        return res.status(200).json({message: "Contribution deleted", contribution: contribution});
    } catch (error) {
        console.log(error.message);
        return res.status(500).json(error.message);
    }
}

module.exports = {
    addCashContribution,
    getAllContributions,
    getContributionById,
    getContributionsByType,
    getContributionsByProfileId,
    getContributionsByAccountId,
    updateContribution,
    deleteContribution
}