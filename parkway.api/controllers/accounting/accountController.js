const mongoose = require('mongoose');
const Account = require('../../models/accounting/accountModel');
const ValidationHelper = require('../../helpers/validationHelper');
const UserValidation = require('../../helpers/userValidation');
const AppError = require('../../applicationErrors');
const { AccountType, AccountRestriction } = require('../../models/constants');

const createAccount = async (req, res, next) => {
    try {
        if(!req.body.name){ throw new AppError.MissingRequiredParameter('createAccount', 'The name of the account is required')}
        if(!req.body.type){ throw new AppError.MissingRequiredParameter('createAccount', 'The type of the account is required')}
        if(req.body.custodian & !mongoose.Types.ObjectId.isValid(req.body.custodian)){ throw new AppError.InvalidId('createAccount', 'The custodian ID is invalid')}
        if(req.body.custodian & !await UserValidation.profileExists(req.body.custodian)){ throw new AppError.CustodianProfileMissing('createAccount')}
        if(req.body.parent & !mongoose.Types.ObjectId.isValid(req.body.parent)){ throw new AppError.InvalidId('createAccount', 'The parent ID is invalid')}
        if(req.body.parent & !await AccountValidation.accountExists(req.body.parent)){ throw new AppError.NotFound('createAccount', 'The parent account does not exist')}
        if(req.body.children){
            for (const child of req.body.children) {
                if(!mongoose.Types.ObjectId.isValid(child)){ throw new AppError.InvalidId('createAccount', 'A child ID is invalid')}
                if(!await AccountValidation.accountExists(child)){ throw new AppError.NotFound('createAccount', 'A child account does not exist')}
            }
        }
        if(req.body.sibling){
            if(!mongoose.Types.ObjectId.isValid(req.body.sibling)){ throw new AppError.InvalidId('createAccount', 'The sibling ID is invalid')}
            if(!await AccountValidation.accountExists(req.body.sibling)){ throw new AppError.NotFound('createAccount', 'The sibling account does not exist')}
        }

        const accountName = ValidationHelper.sanitizeString(req.body.name);
        const accountType = req.body.type;
        const accountCustodian = req.body.custodian;
        const accountParent = req.body.parent;
        const accountChildren = req.body.children;
        const accountSibling = req.body.sibling;

        const isDuplicate = await ValidationHelper.checkDuplicateAccount(accountName, accountType);
        if(isDuplicate){ throw new AppError.DuplicateAccount('createAccount')}

        const account = new Account({
            name: accountName,
            type: accountType,
            custodian: accountCustodian,
            parent: accountParent,
            children: accountChildren,
            sibling: accountSibling
        }).save({new: true});

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
            .populate('children')
            .populate('sibling');
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
                .populate('children')
                .populate('sibling');
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

const getAccountsByType = async (req, res, next) => {
    try {
        const {type} = req.params;
        if(!type){ throw new AppError.MissingRequiredParameter('getAccountByType')}
        if(type === 'revenue' || type === 'fund' || type === 'expense' || type === 'asset' || type === 'liability' || type === 'cash' || type === 'unknown'){

            const {populate = false} = req.query;
            let accounts;
    
            if(populate === 'true'){
                accounts = await Account.findById(id)
                    .populate('custodian')
                    .populate('parent')
                    .populate('children')
                    .populate('sibling');
            } else {
                accounts = await Account.findById(id);
            }
    
            if(accounts.length === 0){ return res.status(200).json('No accounts found with that type.')}

            return res.status(200).json(accounts);
        }
        throw new AppError.InvalidAccountType('getAccountByType');
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
            account = await Account.findOne({name: name }).collation({locale: "en", strength: 2})
                .populate('custodian')
                .populate('parent')
                .populate('children')
                .populate('sibling');
        } else {
            account = await Account.findOne({name: name }).collation({locale: "en", strength: 2});
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
        if(req.body.type && (req.body.type === 'expense' || req.body.type === 'revenue' || req.body.type === 'asset' || req.body.type === 'liability')){ updateData.type = req.body.type }
        
        let controlMessages = [];
        if(req.body.custodian){controlMessages.push('Custodian account cannot be updated via this endpoint.') }
        if(req.body.parent){controlMessages.push('Parent account cannot be updated via this endpoint.')}
        if(req.body.childId){controlMessages.push('Children accounts cannot be updated via this endpoint.')}
        if(req.body.notes){controlMessages.push('Notes cannot be updated via this endpoint.')}

        let account =  await Account.findByIdAndUpdate( id, updateData, { new: true, runValidators: true});
        if(!account){ throw new AppError.NotFound('updateAccountById', 'No account found for that Id.')}

        const populate = req.query.populate;
        if (populate === 'true') {
            account = await Account.findById(id)
                .populate('custodian')
                .populate('parent')
                .populate('children')
                .populate('sibling');           
        }

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
        const accountId = req.params.accountId;
        if(!accountId){ throw new AppError.MissingId('updateAccountCustodian', 'No account ID provided.')}
        if (!mongoose.Types.ObjectId.isValid(accountId)) { throw new AppError.InvalidId('updateAccountCustodian', 'Invalid account ID.')}
    
        const custodianId = req.body.custodianId;

        if(!custodianId){ throw new AppError.RequestBodyMissing('updateAccountCustodian', 'No custodian ID provided.') }
        if (!mongoose.Types.ObjectId.isValid(custodianId)) { throw new AppError.InvalidId('updateAccountCustodian', 'Invalid custodian ID.')}

        const profileExists = await UserValidation.profileExists(custodianId);
        if(!profileExists){ throw new AppError.CustodianProfileMissing('updateAccountCustodian');}

        populate = req.query.populate;
        let account;
        if(populate === 'true'){
            const account =  await Account.findByIdAndUpdate( accountId, {custodian: custodianId}  , { new: true, runValidators: true})
                .populate('custodian')
                .populate('parent')
                .populate('children')
                .populate('sibling');
        } else {
            account =  await Account.findByIdAndUpdate( accountId, {custodian: custodianId}  , { new: true, runValidators: true});
        }
        
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
    
        const  parent  = req.body.parent;
        if (!parent) { throw new AppError.MissingId('addAccountParent','The parent account Id is missing') }        
        if (!mongoose.Types.ObjectId.isValid(parent)) { throw new AppError.MissingId('addAccountParent','The parent account Id you provided is invalid') }
        if(!ValidationHelper.validateAccountId(parent)){ throw new AppError.AccountUpdate('addAccountParent','The parent account you provided does not exist') }
        
        populate = req.query.populate;
        let account;
        if(populate === 'true'){
            account =  await Account.findByIdAndUpdate( accountId, {parent: parent }, { new: true, runValidators: true})
                .populate('parent')
                .populate('children')
                .populate('sibling')
                .populate('custodian');
        } else {
            account =  await Account.findByIdAndUpdate( accountId, {parent: parent}, { new: true, runValidators: true});
        }

        if(!account){ throw new AppError.AccountUpdate('addAccountParent','Child account could not be found')}

        const parentAccount = await Account.findByIdAndUpdate(parent, {
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
            }, { new: true, runValidators: true});

        if(!account){ throw new AppError.NotFound('addAccountChildren','The account could not be found with that Id.')}

        const updateChildrenPromises = validChildren.map(childId =>
            Account.findByIdAndUpdate(childId, {parent: accountId}, {new: true, runValidators: true})
        );
        await Promise.all(updateChildrenPromises);

        const populate = req.query.populate;
        if(populate === 'true'){
            account = await Account.findById(accountId)
                .populate('custodian')
                .populate('parent')
                .populate('children')
                .populate('custodian');
        }

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

const addSiblingIds = async (fundAccountId, expenseAccountId) => {
    await Account.findByIdAndUpdate(fundAccountId, {sibling: expenseAccountId}, {runValidators: true});
    await Account.findByIdAndUpdate(expenseAccountId, {sibling: fundAccountId}, {runValidators: true});
}

module.exports = {
    createAccount,
    getAllAccounts,
    getAccountById,
    getAccountByName,
    getAccountsByType,
    updateAccountById,
    updateAccountCustodian,
    addAccountParent,
    addAccountChildren,
    deleteAccountById
}