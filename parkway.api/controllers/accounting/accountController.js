const mongoose = require('mongoose');
const Account = require('../../models/accounting/accountModel');
const ValidationHelper = require('../../helpers/validationHelper');
const AccountValidation = require('../../helpers/accountValidation');

const addAccount = async (req, res) => {
    try {
        if(!req.body.name){ throw new Error('No account name provided.')}
        req.body.name = ValidationHelper.sanitizeString(req.body.name); 

        const account = new Account(req.body);

        // const validationError = account.validateSync();
        // if(validationError){ throw new Error(validationError.message) }

        await account.save();
        return res.status(201).json(account);
    } catch (error) {
        console.log(error.message);
        if (error.code === 11000) { return res.status(400).json({ message: 'Account already exists with that name.' })};
        return res.status(500).json(error.message);
    }
}

const getAllAccounts = async (req, res) => {

    try {
        const accounts = await Account.find({}).populate('custodian').populate('parent').populate('children');
        if(accounts.length === 0){ throw new Error( 'No accounts were returned.') }
        return res.status(200).json(accounts);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json(error.message);
    }
}

const getAccountById = async (req, res) => {
    try {
        const id = req.params.id;
        if(!id){ throw new Error('No account ID provided.')}
        if (!mongoose.Types.ObjectId.isValid(id)) { throw new Error("Invalid ID.")}

        const account = await Account.findById(req.params.id).populate('custodian').populate('parent').populate('children');
        if(!account){ throw new Error('No account found.')}
        
        res.status(200).json(account);

    } catch (error) {
        console.log(error.message);
        return res.status(500).json(error.message);
    }

    try {
    } catch (error) {
        res.status(500).json(error.message);
    }
}

const getAccountByName = async (req, res) => {
    try {
        const {name} = req.params;
        if(!name){ throw new Error('No account name provided.')}

        const account = await Account.findOne({name: name }).collation({locale: "en", strength: 2})
            .populate('custodian').populate('parent').populate('children');
        if(!account){ throw new Error('No account found.')}

        return res.status(200).json(account);

    } catch (error) {
        console.log(error.message);
        return res.status(500).json(error.message);
    }
}

const updateAccountById = async (req, res) => {
    try {
        const { id } = req.params;
        if(!id){ throw new Error('No account ID provided.')}
        if (!mongoose.Types.ObjectId.isValid(id)) { throw new Error("Invalid account ID.")}
    
        const updateData = {};

        if(req.body.name){ updateData.name = ValidationHelper.sanitizeString(req.body.name) }

        if(req.body.description){ updateData.description = ValidationHelper.sanitizeString(req.body.description) }
        if(req.body.type && (req.body.type === "expense" || req.body.type === "income")){ updateData.type = req.body.type }
        
        let controlMessages = [];
        if(req.body.custodian){controlMessages.push('Custodian account cannot be updated via this endpoint.') }
        if(req.body.parent){controlMessages.push('Parent account cannot be updated via this endpoint.')}
        if(req.body.children){controlMessages.push('Children accounts cannot be updated via this endpoint.')}
        if(req.body.notes){controlMessages.push('Notes cannot be updated via this endpoint.')}

        let account =  await Account.findByIdAndUpdate( id, updateData, { new: true, runValidators: true})
            .populate('custodian').populate('parent').populate('children');
        if(!account){ throw new Error('Account could not be found.')}

        if(controlMessages.length > 0){ return res.status(200).json({account: account, controlMessages: controlMessages}); }
        return res.status(200).json({account: account});
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json(error);
    }
}

const updateAccountCustodian = async (req, res) => {
    try {
        const { id } = req.params;
        if(!id){ throw new Error('No account ID provided.')}
        if (!mongoose.Types.ObjectId.isValid(id)) { throw new Error("Invalid account ID.")}
    
        const updateData = {};

        if(req.body.custodian){
            const custodianId = req.body.custodian;
            if (!mongoose.Types.ObjectId.isValid(custodianId)) { throw new Error("Invalid custodian ID.")}
            if(custodianId && !AccountValidation.profileExists(custodianId)){ throw new Error('The profile specified for the custodian does not exist.')}
            updateData.custodian = req.body.custodian;
        }

        let account =  await Account.findByIdAndUpdate( id, updateData, { new: true, runValidators: true})
            .populate('custodian').populate('parent').populate('children');
        if(!account){ throw new Error('Account could not be found.')}

        return res.status(200).json(account);
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json(error);
    }
}

const addAccountParent = async (req, res) => {
    try {
        const { accountId } = req.params;
        if(!accountId){ throw new Error('No account ID provided.')}
        if (!mongoose.Types.ObjectId.isValid(accountId)) { throw new Error("Invalid account ID.")}
    
        const updateData = {};

        const parentId = req.body.parent;
        if(!parentId){ throw new Error('No parent account ID provided.')}
        if (!mongoose.Types.ObjectId.isValid(parentId)) { throw new Error("Invalid parent ID.")}
        if(parentId && !AccountValidation.accountExists(parentId)){ throw new Error('The parent account does not exist.')}
        updateData.parent = req.body.parent;

        let account =  await Account.findByIdAndUpdate( accountId, updateData, { new: true, runValidators: true})
            .populate('parent').populate('children');
        if(!account){ throw new Error('Account could not be found.')}

        const parentAccount = await Account.findByIdAndUpdate(parentId, {
            $addToSet: { children: accountId }
        }, {new: true, runValidators: true});

        if(!parentAccount){ throw new Error('Parent account could not be updated.')}

        return res.status(200).json(account);
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json(error);
    }
}

const addAccountChildren = async (req, res) => {
    try {
        const { accountId } = req.params;
        if(!accountId){ throw new Error('No account ID provided.')}
        if (!mongoose.Types.ObjectId.isValid(accountId)) { throw new Error("Invalid account ID.")}
    
        const children = req.body.children;
        if(!children || children.length === 0){ throw new Error('No children accounts provided.')}

        const validChildren = [];
        for (const child of children) {
            if (!mongoose.Types.ObjectId.isValid(child)) { throw new Error("Invalid child ID.")}
            if(!(await AccountValidation.accountExists(child))){ throw new Error('The child account does not exist.') }
            validChildren.push(child);
        }

        let account = await Account.findByIdAndUpdate(accountId, { 
            $addToSet: { children: { $each: validChildren } } 
            }, { new: true, runValidators: true})
            .populate('parent').populate('children');

        if(!account){ throw new Error('Account could not be found.')}

        const updateChildrenPromises = validChildren.map(childId =>
            Account.findByIdAndUpdate(childId, {parent: accountId}, {new: true, runValidators: true})
        );
        await Promise.all(updateChildrenPromises);

        return res.status(200).json(account);
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json(error);
    }
}

//TODO: Add a check to see if the account has any donations before deleting
//TODO: Add a check to see if the account has any budgets before deleting
//TODO: Add a check to see if the account has any transactions before deleting
const deleteAccountById = async (req, res) => {
    try {
        const id = req.params.id;
        if(!id){ throw new Error('No account ID provided.')}
        if (!mongoose.Types.ObjectId.isValid(id)) { throw new Error("Invalid ID.")}

        const account = await Account.findByIdAndDelete(id);
        if(!account){ throw new Error( "Account could not be found.  Account was not deleted.") }

        return res.status(200).json({message: account.name + ' was deleted.', account: account});

    } catch (error) {
        console.log(error.message);
        return res.status(500).json(error.message);
    }
}

module.exports = {
    addAccount,
    getAllAccounts,
    getAccountById,
    getAccountByName,
    updateAccountById,
    updateAccountCustodian,
    addAccountParent,
    addAccountChildren,
    deleteAccountById
}