const mongoose = require('mongoose')
const Contribution = require('../../models/accounting/contributionModel')
const ValidationHelper = require('../../helpers/validationHelper');
const UserValidation = require('../../helpers/userValidation');
const Deposit = require('../../models/accounting/depositModel');
const AppError = require('../../applicationErrors')
const { TransactionType } = require('../../models/constants');
const { createTransaction } = require('../../helpers/transactionHelper');

const createContributions = async (req, res, next) => {
    try {
        const array = req.body;
        const totalAccounts = array.reduce((acc, item) => acc + item.accounts.length, 0);
        const results = await Promise.all(array.map(item => addContribution(item)));

        const successfulContributions = results.filter(result => result.errors.length === 0).map(result => result.contribution); 
        const failedContributions = results.filter(result => result.errors.length > 0).map(result => ({ 
            data: result.contribution, 
            errors: result.errors 
        })); 

        return res.status(201).json({ successfulContributions, failedContributions }); 

    } catch (error) {
        next(error);
    }
};

const addContribution = async (data) => {
    const result = { contribution: null, errors: [] };
    try {
        const {
            gross, fees, net, accounts,
            contributorProfileId, depositId,
            transactionDate, type, notes,
            responsiblePartyProfileId
        } = data;

        if (!gross) throw new AppError.MissingRequiredParameter('addContribution', 'The request body is missing the gross amount');
        if (fees === undefined || fees === null) throw new AppError.MissingRequiredParameter('addContribution', 'The request body is missing the fees amount');
        if (!net) throw new AppError.MissingRequiredParameter('addContribution', 'The request body is missing the net amount');
        if (!accounts || !Array.isArray(accounts)) throw new AppError.MissingRequiredParameter('addContribution', 'The request body is missing the accounts array');
        if (!responsiblePartyProfileId) throw new AppError.MissingRequiredParameter('addContribution', 'The request body is missing the responsible party profile Id');
        if (!mongoose.Types.ObjectId.isValid(responsiblePartyProfileId)) throw new AppError.InvalidId('addContribution', 'The responsible party profile Id is not valid');
        if (!ValidationHelper.validateProfileId(responsiblePartyProfileId)) throw new AppError.ProfileDoesNotExist('addContribution', 'The responsible party profile does not exist');

        if (contributorProfileId) {
            if (!mongoose.Types.ObjectId.isValid(contributorProfileId)) throw new AppError.InvalidId('addContribution', `${contributorProfileId} is not a valid mongo id`);
            const profileExists = await UserValidation.profileExists(contributorProfileId);
            if (!profileExists) result.errors.push(new AppError.ProfileDoesNotExist('addContribution', 'The specified contributor profile does not exist'));
        }

        const accountErrors = await ValidationHelper.validateAccountIds(accounts);
        if (accountErrors.length > 0) {
            result.errors.push(new AppError.Validation('addContribution', accountErrors.join(', '), 'VALIDATION_ERROR', accountErrors));
        }

        const accountsTotal = accounts.reduce((total, account) => total + account.amount, 0);
        if (net !== accountsTotal) result.errors.push(new AppError.Validation('addContribution', 'The sum of the accounts does not equal the contribution net amount'));

        let deposit;
        if (depositId) {
            if (!mongoose.Types.ObjectId.isValid(depositId)) throw new AppError.InvalidId('addContribution', 'The supplied deposit Id is not valid');
            deposit = await Deposit.findById(depositId);
            if (!deposit) result.errors.push(new AppError.DepositDoesNotExist('addContribution', 'The specified deposit does not exist'));
        }

        const contribution = new Contribution({
            contributorProfileId, responsiblePartyProfileId,
            gross, fees, net, accounts,
            transactionDate, depositId, type, notes
        });

        const validationError = contribution.validateSync();
        if (validationError) result.errors.push(new AppError.Validation('addContribution', validationError.message));

        if (result.errors.length === 0) {
            await contribution.save({ new: true });
            result.contribution = contribution;

            if (deposit) {
                deposit.contributions.push(contribution._id);
                await deposit.save();
            }

            for (let account of accounts) {
                await createTransaction(account.amount, TransactionType.DEPOSIT, account.accountId, null, responsiblePartyProfileId);
            }
        }

        return result;
    } catch (error) {
        result.errors.push(error.message || error);
        return result;
    }
};



//TODO: Check to see if this is a duplicate contribution
// const addContribution = async (req, res, next) => {
//     try {
//         const { gross, fees, net, accounts, contributorProfileId, depositId, transactionDate, type, notes, responsiblePartyProfileId } = req.body;

//         if (!gross) { throw new AppError.MissingRequiredParameter('addContribution', 'The request body is missing the gross amount'); }
//         if (fees === undefined || fees === null) { throw new AppError.MissingRequiredParameter('addContribution', 'The request body is missing the fees amount'); }
//         if (!net) { throw new AppError.MissingRequiredParameter('addContribution', 'The request body is missing the net amount'); }
//         if (!accounts || !Array.isArray(accounts)) { throw new AppError.MissingRequiredParameter('addContribution', 'The request body is missing the accounts array'); }
//         if (!responsiblePartyProfileId){ throw new AppError.MissingRequiredParameter('addContribution', 'The request body is missing the responsible party profile Id'); }
//         if (!mongoose.Types.ObjectId.isValid(responsiblePartyProfileId)){ throw new AppError.InvalidId('addContribution', 'The responsible party profile Id is not valid'); }
//         if (!ValidationHelper.validateProfileId(responsiblePartyProfileId)){ throw new AppError.ProfileDoesNotExist('addContribution', 'The responsible party profile does not exist'); }

//         if (contributorProfileId) {
//             if (!mongoose.Types.ObjectId.isValid(contributorProfileId)) { throw new AppError.InvalidId('addContribution', `${contributorProfileId} is not a valid mongo id`); }
//             const profileExists = await UserValidation.profileExists(contributorProfileId);
//             if (!profileExists) { throw new AppError.ProfileDoesNotExist('addContribution', 'The specified contributor profile does not exist'); }
//         }

//         const accountErrors = await ValidationHelper.validateAccountIds(req.body.accounts);
//         if (accountErrors.length > 0) { throw new AppError.Validation('addContribution', accountErrors); }

//         const accountsTotal = accounts.reduce((total, account) => total + account.amount, 0);
//         if (net !== accountsTotal) { throw new AppError.Validation('addContribution', 'The sum of the accounts does not equal the contribution net amount'); }
        
//         let deposit;
//         if (depositId) {
//             if (!mongoose.Types.ObjectId.isValid(depositId)) { throw new AppError.InvalidId('addContribution', 'The supplied deposit Id is not valid'); }
//             deposit = await Deposit.findById(depositId);
//             if (!deposit) { throw new AppError.DepositDoesNotExist('addContribution', 'The specified deposit does not exist'); }
//         }      

//         const contribution = new Contribution({
//             contributorProfileId,
//             responsiblePartyProfileId,
//             gross,
//             fees,
//             net,
//             accounts,
//             transactionDate,
//             depositId,
//             type,
//             notes
//         });

//         const validationError = contribution.validateSync();
//         if (validationError) { throw new AppError.Validation('addContribution', validationError.message) }

//         await contribution.save({ new: true });

//         if (deposit) {
//             deposit.contributions.push(contribution._id);
//             await deposit.save();
//         }

//         for (let account of accounts) { await createTransaction(account.amount, TransactionType.DEPOSIT, account.accountId, null, responsiblePartyProfileId); }

//         return res.status(201).json(contribution);

//     } catch (error) {
//         next(error)
//         console.log({method: error.method, message: error.message});
//     }
// }

//TODO: Add pagination
const getAllContributions = async (req, res, next) => {
    try {
        const contributions = await Contribution.find({});
        
        if(contributions.length === 0) { return res.status(204).json({contributions: contributions, message: 'No contributions were returned.'})}
        
        return res.status(200).json(contributions);
    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const getContributionsByDeposit = async (req, res, next) => {
    try {
        const depositId = req.params.id;
        if (!depositId) { throw new AppError.MissingId('getContributionsByDeposit'); }

        const contributions = await Contribution.find({ depositId });

        if(contributions.length === 0) { return res.status(204).json({contributions: contributions, message: 'No contributions were returned.'})}

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

        if(contributions.length === 0){ return res.status(204).json({contributions: contributions, message: 'No contributions were returned.'})}

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
        if(!contribution) { return res.status(204).json({message: 'No contribution found for that Id.'})};

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
            if(contributions.length === 0) { return res.status(204).json({message: 'No contributions were returned for the given type in the specified date range.'})}
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
            if(contributions.length === 0) { return res.status(204).json({message: 'No contributions were returned for the given profile Id and the specified date range.'})}
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
            if(contributions.length === 0) { return res.status(204).json({message: 'No contributions were returned for the given account Id and the specified date range.'})}
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
    createContributions,
    // addContribution,
    getAllContributions,
    getContributionById,
    getContributionsByType,
    getContributionsByProfileId,
    getContributionsByAccountId,
    getContributionsByDateRange,
    updateContribution,
    deleteContribution,
    getContributionsByDeposit
}