const mongoose = require('mongoose')
const Contribution = require('../../models/accounting/contributionModel')
const ValidationHelper = require('../../helpers/validationHelper');
const UserValidation = require('../../helpers/userValidation');
const Deposit = require('../../models/accounting/depositModel');
const AppError = require('../../applicationErrors')
const Account = require('../../models/accounting/accountModel');
const Transaction = require('../../models/accounting/transactionModel');

const addContribution = async (req, res, next) => {
    try {
        if(!req.body){throw new AppError.RequestBodyMissing('addContribution')};

        if(req.body.profile){
            if (!mongoose.Types.ObjectId.isValid(req.body.profile)) { throw new AppError.InvalidId('addContribution')}
            if(!await UserValidation.profileExists(req.body.profile)){throw new AppError.ProfileDoesNotExist('addContribution')}
        }

        if (!req.body.accounts || req.body.accounts.length === 0){
            let generalFund = await Account.findOne({name: 'General Fund'});
            if(!generalFund){
                generalFund = new Account({name: 'General Fund', type: 'fund'});
                await generalFund.save();
            }
            req.body.accounts = [{accountId: generalFund._id, amount: req.body.net}];
        }

        const accountErrors = await ValidationHelper.validateAccountIds(accountIds);
        if (accountErrors.length > 0) { throw new AppError.Validation('addContribution', accountErrors); }

        let deposit;
        if(req.body.depositId){
            if (!mongoose.Types.ObjectId.isValid(req.body.depositId)) { throw new AppError.InvalidId('addContribution')}
            deposit = await Deposit.findById(req.body.depositId);
            if(!deposit){throw new AppError.DepositDoesNotExist('addContribution')}
        }        

        const contribution = new Contribution(req.body);

        const validationError = contribution.validateSync();
        if (validationError) { throw new AppError.Validation('addContribution', validationError.message) }

        await contribution.save({new: true});

        for(let i = 0; i < contribution.accounts.length; i++){
            const accountId = contribution.accounts[i].accountId
            let account = await Account.findById(accountId);

            if(!account){ throw new AppError.NotFound('addContribution', `The account with the id ${accountId} was not found.`)}

            const sourceAccount = await Account.findOne({name: 'Unallocated'});
            const transaction = new Transaction({
                amount: contribution.accounts[i].amount,
                type: 'deposit',
                toAccount: { accountId: accountId },
                createdBy: contribution.profile,
                contributionId: contribution._id
            });
        }


        deposit.contributions.push(contribution._id);
        await deposit.save();



        return res.status(201).json(contribution);

    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

//TODO: Add pagination
const getAllContributions = async (req, res, next) => {

    try {
        const contributions = await Contribution.find({});
        
        if(contributions.length === 0) { return res.status(200).json({contributions: contributions, message: 'No contributions were returned.'})}
        
        return res.status(200).json(contributions);
    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const getContributionsByDateRange = async (req, res, next) => {
    try {
        const { startDate, endDate, dateType } = req.query;
        if(!startDate || !endDate){ throw new AppError.MissingDateRange('getContributionsByDateRange')}
        if(ValidationHelper.checkDateOrder(startDate, endDate)){ throw new AppError.InvalidDateRange('getContributionsByDateRange')}
        if(!dateType === 'transactionDate'){ dateType = 'depositDate'}

        let contributions;

        if(dateType === 'depositDate'){
            contributions = await Contribution.find({
                depositDate: {
                    $gte: startDate,
                    $lte: endDate
                }
            }).sort({ depositDate: 1});
        } else {
            contributions = await Contribution.find({
                transactionDate: {
                    $gte: startDate,
                    $lte: endDate
                }
            }).sort({ transactionDate: 1});
        }

        if(contributions.length === 0){ return res.status(200).json({contributions: contributions, message: 'No contributions were returned.'})}

        return res.status(200).json(contributions);
    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const getContributionById = async (req, res, next) => {
    try {
        if(!req.params.id){ throw new AppError.MissingId('getContributionById')}
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){ throw new AppError.InvalidId('getContributionById')}

        const contribution = await Contribution.findById(req.params.id);
        if(!contribution) { return res.status(200).json({message: 'No contribution found for that Id.'})};

        return res.status(200).json(contribution);
    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

//TODO: Add pagination
const getContributionsByType = async (req, res, next) => {
    try {
        if(!req.params.type){ throw new AppError.MissingRequiredParameter('getContributionsByType','No Contribution type provided.')}
        const { startDate, endDate, dateType } = req.query;

        let contributions;

        if(!startDate || !endDate){
            contributions = await Contribution.find({ type: req.params.type });
        } else {
            if(!dateType === 'transactionDate'){ dateType = 'depositDate'}

            if(dateType === 'depositDate'){
                contributions = await Contribution.find({
                    type: req.params.type,
                    depositDate: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }).sort({ depositDate: 1});
            } else {
                contributions = await Contribution.find({
                    type: req.params.type,
                    transactionDate: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }).sort({ transactionDate: 1});
            }
            if(contributions.length === 0) { return res.status(200).json({message: 'No contributions were returned for the given type in the specified date range.'})}
        }
        if(contributions.length === 0) { return res.status(200).json({message: 'No contributions were returned.'})} 
        return res.status(200).json(contributions);
    }
    catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

//TODO: Add pagination
const getContributionsByProfileId = async (req, res, next) => {
    try {
        if(!req.params.id){ throw new AppError.MissingId('getContributionsByProfileId')}
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){ throw new AppError.InvalidId('getContributionsByProfile')}

        const { startDate, endDate, dateType } = req.query;

        let contributions;

        if(!startDate || !endDate){
            contributions = await Contribution.find({ profile: req.params.id });
        } else {
            if(!dateType === 'transactionDate'){ dateType = 'depositDate'}

            if(dateType === 'depositDate'){
                contributions = await Contribution.find({
                    profile: req.params.id,
                    depositDate: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }).sort({ depositDate: 1});
            } else {
                contributions = await Contribution.find({
                    profile: req.params.id,
                    transactionDate: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }).sort({ transactionDate: 1});
            }
            if(contributions.length === 0) { return res.status(200).json({message: 'No contributions were returned for the given profile Id and the specified date range.'})}
        }

        if(contributions.length === 0) { return res.status(200).json({message: 'No contributions were returned.'})}
        
        return res.status(200).json(contributions);
    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

//TODO: Add pagination
const getContributionsByAccountId = async (req, res, next) => {
    try {
        if(!req.params.id){ throw new AppError.MissingId('getContributionsByAccountId')}
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){ throw new AppError.InvalidId('getContributionsByAccountId')}

        const { startDate, endDate, dateType } = req.query;

        let contributions;

        if(!startDate || !endDate){
            contributions = await Contribution.find({ 'accounts.account': req.params.id });
        } else {
            if(!dateType === 'transactionDate'){ dateType = 'depositDate'}

            if(dateType === 'depositDate'){
                contributions = await Contribution.find({
                    'accounts.account': req.params.id,
                    depositDate: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }).sort({ depositDate: 1});
            } else {
                contributions = await Contribution.find({
                    'accounts.account': req.params.id,
                    transactionDate: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }).sort({ transactionDate: 1});
            }
            if(contributions.length === 0) { return res.status(200).json({message: 'No contributions were returned for the given account Id and the specified date range.'})}
        }

        if(contributions.length === 0) { return res.status(200).json({message: 'No contributions were returned.'})}

        return res.status(200).json(contributions);
    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const updateContribution = async (req, res, next) => {
    try {
        if(!req.params.id){ throw new AppError.MissingId('updateContribution')}
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){ throw new AppError.InvalidId('updateContribution')}
        if (!req.body) { throw new AppError.MissingRequestBody('updateContribution') }
        if (Object.keys(req.body).length === 0) { throw new AppError.MissingRequiredParameter('updateContribution','The request body did not have any keys.') }

        const contribution = await Contribution.findById(req.params.id);
        if(!contribution){ throw new AppError.NotFound('updateContribution')}

        let protected = false;
        if(contribution.processedDate){ protected = true }

        if(protected){
            if(req.body.hasOwnProperty('net') && req.body.net !== contribution.net){
                throw new AppError.ProtectedContribution('updateContribution', 'The contribution is protected because it belongs to a processed deposit and you have included a net amount that is different than the original net amount.');
            }
            if(req.body.hasOwnProperty('gross') && req.body.gross !== contribution.gross){
                throw new AppError.ProtectedContribution('updateContribution', 'The contribution is protected because it belongs to a processed deposit and you have included a gross amount that is different than the original gross amount.');
            }
            if(req.body.hasOwnProperty('fees') && req.body.fees !== contribution.fees){
                throw new AppError.ProtectedContribution('updateContribution', 'The contribution is protected because it belongs to a processed deposit and you have included a fees amount that is different than the original fees amount.');
            }
            if(req.body.hasOwnProperty('depositId') && req.body.depositId !== contribution.depositId){
                throw new AppError.ProtectedContribution('updateContribution', 'The contribution is protected because it belongs to a processed deposit and you have included a depositId that is different than the original depositId.');
            }
            if(req.body.hasOwnProperty('processedDate') && req.body.processedDate !== contribution.processedDate){
                throw new AppError.ProtectedContribution('updateContribution', 'The contribution is protected because it belongs to a processed deposit and you have included a processedDate that is different than the original processedDate.');
            }
        }

        Object.keys(req.body).forEach(key => {
            contribution[key] = req.body[key];
        });
        
        const validationError = contribution.validateSync();
        if (validationError) { throw new AppError.Validation('updateContribution', validationError.message ) }
        
        const updatedContribution = await contribution.save();
        if(!updatedContribution) throw new AppError.UpdateFailed('updateContribution');

        return res.status(200).json(updatedContribution);
    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

//TODO:  Adjust the ledger before removing the contribution
const deleteContribution = async (req, res) => {
    try {
        if(!req.params.id){ throw new AppError.MissingId('deleteContribution') }
        if(!ValidationHelper.validateId(req.params.id)){ throw new AppError.InvalidId('deleteContribution')}

        const contribution = await Contribution.findById(req.params.id);
        if(!contribution){ throw new AppError.NotFound('deleteContribution', 'The specified contribution was not found.')};
        if(contribution.depositDate){ throw new AppError.DeleteFailed('deleteContribution', 'This contribution has already been deposited and cannot be deleted.  You may only assign it to another profile or change the distribution between accounts.')}
        
        return res.status(200).json({message: "Contribution deleted", contribution: contribution});
    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

module.exports = {
    addContribution,
    getAllContributions,
    getContributionById,
    getContributionsByType,
    getContributionsByProfileId,
    getContributionsByAccountId,
    getContributionsByDateRange,
    updateContribution,
    deleteContribution
}