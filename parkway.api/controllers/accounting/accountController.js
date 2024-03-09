const mongoose = require('mongoose');
const Account = require('../../models/accounting/accountModel');
const ValidationHelper = require('../../helpers/validationHelper');

//Post an account
const addAccount = async (req, res) => {
    if(req.body.name){ req.body.name = ValidationHelper.sanitizeString(req.body.name); }

    const account = new Account(req.body);

    const validationError = account.validateSync();
    if(validationError){ return res.status(400).json({message: validationError.message}) }

    try {
        await account.save();
        return res.status(201).json(account);
    } catch (error) {
        if (error.code === 11000) { return res.status(400).json({ message: 'Account already exists with that name.' })};
        return res.status(500).json(error.message);
    }
}

//Get all accounts
const getAllAccounts = async (req, res) => {

    try {
        const accounts = await Account.find({});
        if(accounts.length === 0){ return res.status(200).json({message: 'No accounts were returned.'}) }
        return res.status(200).json(accounts);
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

//Get an account by ID
const getAccountById = async (req, res) => {

    if(!req.params.id){ return res.status(400).json({error: 'No account ID provided.'})}
    if(!ValidationHelper.validateId(req.params.id)){ return res.status(404).json({error: 'Id is not valid.'}) }

    try {
        const account = await Account.findById(req.params.id);
        if(!account){ return res.status(200).json({message: 'No account found.'}) }
        res.status(200).json(account);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

//Get an account by name
const getAccountByName = async (req, res) => {
    
    if(!req.params.name){ return res.status(400).json({error: 'No account name provided.'}) }

    try {
        const account = await Account.find({ name: req.params.name })
                                     .collation({locale: "en", strength: 2});
        if(!account){ return res.status(200).json({message: 'No account found.'}) }
        return res.status(200).json(account);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

//Update an account by ID
const updateAccount = async (req, res) => {
    const id = req.params.id;
    if(!id){ return res.status(400).json({error: 'No account ID provided.'})}
    if(!ValidationHelper.validateId(id)){ return res.status(404).json({error: 'Id is not valid.'}) }
    
    if(req.body.name){ req.body.name = ValidationHelper.sanitizeString(req.body.name) }

    try {
        let account =  await Account.findByIdAndUpdate({ _id: id }, { ...req.body }, { new: true, runValidators: true});
        if(!account){ return res.status(404).json({error: "Update failed."}) }
        return res.status(200).json(account);
    }
    catch (error) {
        return res.status(400).json(error.message);
    }
}

//Delete an account by ID
//TODO: Add a check to see if the account has any donations before deleting
//TODO: Add a check to see if the account has any budgets before deleting
//TODO: Add a check to see if the account has any transactions before deleting
const deleteAccount = async (req, res) => {
    
    if(!req.params.id){ return res.status(400).json({error: 'No account ID provided.'})}
    if(!ValidationHelper.validateId(req.params.id)){ return res.status(404).json({error: 'Id is not valid.'}) }

    try {
        const account = await Account.findByIdAndDelete(req.params.id);
        if(!account){ return res.status(404).json({error: "Account could not be found.  Account was not deleted."}) }
        return res.status(200).json({message: account.name + ' was deleted.', account: account});
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    addAccount,
    getAllAccounts,
    getAccountById,
    getAccountByName,
    updateAccount,
    deleteAccount
}