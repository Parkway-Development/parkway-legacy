const mongoose = require('mongoose');
const Account = require('../../models/accounting/accountModel');
const ValidationHelper = require('../../helpers/validationHelper');
const UserValidation = require('../../helpers/userValidation');
const AppError = require('../../applicationErrors');

const addAccount = async (req, res, next) => {
    try {
        if(!req.body.name){ throw new AppError.RequestBodyMissing('addAccount')}
        req.body.name = ValidationHelper.sanitizeString(req.body.name); 

        const existingAccount = await Account.findOne({name: req.body.name});
        if(existingAccount){ throw new AppError.DuplicateAccount('addAccount')}

        const account = new Account(req.body);

        await account.save();
        return res.status(201).json(account);
    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const getAllAccounts = async (req, res, next) => {
    try {
        const {populate = false} = req.query;
        let accounts;

        if(populate === 'true'){
            accounts = await Account.find({})
            .populate('custodian')
            .populate('parent')
            .populate('children');
        } else {
            accounts = await Account.find({});
        }

        if(accounts.length === 0){ return res.status(200).json('No accounts found.');}

        return res.status(200).json(accounts);
    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const getAccountById = async (req, res, next) => {
    try {
        const id = req.params.id;
        if(!id){ throw new AppError.MissingId('getAccountById')}
        if (!mongoose.Types.ObjectId.isValid(id)) { throw new AppError.InvalidId('getAccountById')}

        const {populate = false} = req.query;
        let account;

        if(populate === 'true'){
            account = await Account.findById(id)
                .populate('custodian')
                .populate('parent')
                .populate('children');
        } else {
            account = await Account.findById(id);
        }

        if(!account){ return res.status(200).json('No account found for that Id.')}

        res.status(200).json(account);

    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const getAccountByName = async (req, res, next) => {
    try {
        const {name} = req.params;
        if(!name){ throw new AppError.MissingRequiredParameter('getAccountByName')}

        const {populate = false} = req.query;
        let account;

        if(populate === 'true'){
            const account = await Account.findOne({name: name }).collation({locale: "en", strength: 2})
                .populate('custodian')
                .populate('parent')
                .populate('children');
        } else {
            const account = await Account.findOne({name: name }).collation({locale: "en", strength: 2});
        }

        if(!account){ return res.status(200).json('No account found with that name.')}

        return res.status(200).json(account);

    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const updateAccountById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if(!id){ throw new AppError.MissingId('updateAccountById')}
        if (!mongoose.Types.ObjectId.isValid(id)) { throw new AppError.InvalidId('updateAccountById')}
    
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

        if(!account){ throw new AppError.NotFound('updateAccountById', 'No account found for that Id.')}

        if(controlMessages.length > 0){ return res.status(200).json({account: account, controlMessages: controlMessages}); }
        return res.status(200).json({account: account});
    }
    catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const updateAccountCustodian = async (req, res, next) => {
    try {
        const { accountId } = req.params;
        if(!accountId){ throw new AppError.MissingId('updateAccountCustodian', 'No account ID provided.')}
        if (!mongoose.Types.ObjectId.isValid(accountId)) { throw new AppError.InvalidId('updateAccountCustodian', 'Invalid account ID.')}
    
        const updateData = {};

        if(req.body.custodian){
            const custodianId = req.body.custodian;
            if (!custodianId) { throw AppError.RequestBodyMissing('updateAccountCustodian', 'No custodian ID provided.') }
            if (!mongoose.Types.ObjectId.isValid(custodianId)) { throw new AppError.InvalidId('updateAccountCustodian', 'Invalid custodian ID.')}
            
            if(custodianId && !UserValidation.profileExists(custodianId)){ throw new AppError.CustodianProfileMissing('updateAccountCustodian')}
            updateData.custodian = req.body.custodian;
        }

        const account =  await Account.findByIdAndUpdate( accountId, updateData, { new: true, runValidators: true})
            .populate('custodian')
            .populate('parent')
            .populate('children');
        if(!account){ throw new AppError.AccountUpdate('updateAccountCustodian')}

        return res.status(200).json(account);
    }
    catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const addAccountParent = async (req, res, next) => {
    try {
        const { accountId } = req.params;
        if(!accountId){ throw new AppError.MissingId('addAccountParent', 'No account ID provided.')}
        if (!mongoose.Types.ObjectId.isValid(accountId)) { throw new AppError.InvalidId('addAccountParent', 'The account Id you provided is invalid') }
    
        const  { parentId } = req.body.parent;
        if (!parentId) { throw new AppError.MissingId('addAccountParent','The parent account Id is missing') }
        
        if (!mongoose.Types.ObjectId.isValid(parentId)) { 
            throw new AppError.MissingId('addAccountParent','The parent account Id you provided is invalid') }

        const updateData = {};

        if(parentId && !ValidationHelper.validateAccountId(parentId)){ 
            throw new AppError.AccountUpdate('addAccountParent','The parent account you provided does not exist') }
        
        updateData.parent = req.body.parent;

        const account =  await Account.findByIdAndUpdate( accountId, updateData, { new: true, runValidators: true})
            .populate('parent').populate('children');
        if(!account){ throw new AppError.AccountUpdate('addAccountParent','Child account could not be found')}

        const parentAccount = await Account.findByIdAndUpdate(parentId, {
            $addToSet: { children: accountId }
        }, {new: true, runValidators: true});

        if(!parentAccount){ throw new AppError.AccountUpdate('addParentAccount','Parent account could not be updated')}

        return res.status(200).json(account);
    }
    catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const addAccountChildren = async (req, res, next) => {
    try {
        const { accountId } = req.params;
        if(!accountId){ throw new AppError.MissingId('addAccountChildren','The id for the parent account is missing')}
        if (!mongoose.Types.ObjectId.isValid(accountId)) { throw new AppError.InvalidId('The id for the parent account is invalid')}
    
        const children = req.body.children;
        if(!children || children.length === 0){ throw new AppError.MissingId('addAccountChildren','No children account ids wwere provided.')}

        const validChildren = [];
        for (const child of children) {
            if (!mongoose.Types.ObjectId.isValid(child)) { throw new AppError.InvalidId('addAccountChildren',`${child} is not a valid id`)}
            if(!(await AccountValidation.accountExists(child))){ throw new AppError.NotFound('addAccountChildren','A specified child account does not exist.') }
            validChildren.push(child);
        }

        let account = await Account.findByIdAndUpdate(accountId, { 
            $addToSet: { children: { $each: validChildren } } 
            }, { new: true, runValidators: true})
            .populate('parent').populate('children');

        if(!account){ throw new AppError.NotFound('addAccountChildren','The account could not be found with that Id.')}

        const updateChildrenPromises = validChildren.map(childId =>
            Account.findByIdAndUpdate(childId, {parent: accountId}, {new: true, runValidators: true})
        );
        await Promise.all(updateChildrenPromises);

        return res.status(200).json(account);
    }
    catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

//TODO: Add a check to see if the account has any donations before deleting
//TODO: Add a check to see if the account has any budgets before deleting
//TODO: Add a check to see if the account has any transactions before deleting
const deleteAccountById = async (req, res, next) => {
    try {
        const id = req.params.id;
        if(!id){ throw new AppError.MissingId('deleteAccountById')}
        if (!mongoose.Types.ObjectId.isValid(id)) { throw new AppError.InvalidId('deleteAccountById')}

        const account = await Account.findByIdAndDelete(id);
        if(!account){ throw new Error( "Account could not be found.  Account was not deleted.") }

        return res.status(200).json({message: account.name + ' was deleted.', account: account});

    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
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