const mongoose = require('mongoose')
const Deposit = require('../../models/accounting/depositModel')
const AppError = require('../../applicationErrors')
const ValidationHelper = require('../../helpers/validationHelper')
const UserValidation = require('../../helpers/userValidation')
const {DepositStatus} = require('../../models/constants')
const {createTransaction} = require('../../helpers/transactionHelper')
const {TransactionType} = require('../../models/constants')

const createDeposit = async (req, res, next) => {
        try {
        const amount = req.body.amount;
        const responsiblePartyProfileId = req.body.responsiblePartyProfileId;

        if(!amount){ throw new AppError.MissingRequiredParameter('addDeposit', 'No amount was provided.  You cannot have a $0 deposit.') }
        if(!responsiblePartyProfileId){ throw new AppError.MissingRequiredParameter('addDeposit', 'No responsiblePartyProfileId was provided.  The profile of the person responsible for the deposit is required.') }
        if(!mongoose.Types.ObjectId.isValid(responsiblePartyProfileId)){ throw new AppError.InvalidId('addDeposit', 'The responsiblePartyProfileId is not a valid ObjectId.') }

        let deposit = new Deposit;
        deposit.amount = amount;
        deposit.currentStatus = DepositStatus.UNDEPOSITED;
        deposit.statusDate = new Date();
        deposit.history.push({status: deposit.currentStatus, date: deposit.statusDate, responsiblePartyProfileId: responsiblePartyProfileId});

        const validationError = deposit.validateSync();
        if (validationError) { throw new AppError.Validation('addDeposit') }

        await deposit.save();
        return res.status(201).json(deposit);

    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const getAllDeposits = async (req, res, next) => {
    try {
        let deposits;
        if (req.query.populate === 'true') {
            deposits = await Deposit.find()
                .populate('contributions')
                .populate('donations');
        } else {
            deposits = await Deposit.find();
        }

        if (deposits.length === 0) { return res.status(204).json('No deposits found.'); }

        return res.status(200).json(deposits);
    } catch (error) {
        console.log({ method: 'getAllDeposits', message: error.message });
        next(error);
    }
};

const getDepositById = async (req, res, next) => {
    try {
        if(!req.params.id){ throw new AppError.MissingId('getDepositById')}
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){ throw new AppError.InvalidId('getDepositById')}

        let deposit;
        if(req.query.populate){
            deposit = await Deposit.findById(req.params.id)
                .populate('contributions')
                .populate('donations');
        }else{
            deposit = await Deposit.findById(req.params.id);
        }

        if(!deposit){ return res.status(204).json('No deposit found for that Id.')}

        return res.status(200).json(deposit);
    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const getDepositsByStatus = async (req, res, next) => {
    try {
        const status = req.params.status;
        if(!status){ throw new AppError.MissingRequiredParameter('getDepositByStatus', 'No status was provided.')}

        let startDate, endDate;
        if(req.query){
            startDate = req.query.startDate;
            endDate = req.query.endDate;
        }

        let deposits;

        if(!startDate || !endDate){ 
            deposits = await Deposit.find({currentStatus: status});
        }else{
            if(!ValidationHelper.checkDateOrder(startDate, endDate)){ throw new AppError.InvalidDateRange('getDepositByStatus')}
            deposits = await Deposit.find({
                currentStatus: status,
                statusDate: {
                    $gte: new Date(startDate).toISOString(),
                    $lte: new Date(endDate).toISOString()
                }
            }).sort({ statusDate: 1});
        }

        if(deposits.length === 0){ return res.status(204).json('No deposits found')}

        if(req.query.populate){
            deposits = await Deposit.find({currentStatus: status})
                .populate('contributions')
                .populate('donations')
                .populate('history.responsiblePartyProfileId');
        }

        return res.status(200).json(deposits);
    }
    catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const getDepositsByDateRange = async (req, res, next) => {
    try {
        const { startDate, endDate, populate } = req.query;
        if(!startDate || !endDate){ throw new AppError.MissingDateRange('getDepositsByDateRange')}
        if(!ValidationHelper.checkDateOrder(startDate, endDate)){ throw new AppError.InvalidDateRange('getContributionsByDateRange')}

        let deposits;
        if(populate){
            deposits = await Deposit.find({
                date: {
                    $gte: new Date(startDate).toISOString(),
                    $lte: new Date(endDate).toISOString()
                }
            }).sort({ date: 1})
            .populate('contributions')
            .populate('donations')
            .populate('history.responsiblePartyProfileId');
        } else{
            deposits = await Deposit.find({
                date: {
                    $gte: new Date(startDate).toISOString(),
                    $lte: new Date(endDate).toISOString()
                }
            }).sort({ date: 1});
        }

        if(deposits.length === 0){ return res.status(204).json('No deposits found for that date range.')}

        return res.status(200).json(deposits);
    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const updateDeposit = async (req, res, next) => {
    try {
        if(!req.params.id){ throw new AppError.MissingId('updateDeposit')}
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){ throw new AppError.InvalidId('updateDeposit')}

        const deposit = await Deposit.findById(req.params.id);
        if(!deposit) {throw new AppError.NotFound('updateDeposit')};
        if(deposit.currentStatus === DepositStatus.PROCESSED){throw new AppError.DepositAlreadyProcessed('updateDeposit','The deposit has already been processed and cannot be modified.')} 

        Object.keys(req.body).forEach(key => {
            deposit[key] = req.body[key];
        });

        const validationError = deposit.validateSync();
        if (validationError) { throw new AppError.Validation('updateDeposit') }

        await deposit.save({new: true});
        return res.status(200).json(deposit);
    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const deleteDeposit = async (req, res, next) => {
    try {
        if(!req.params.id){ throw new AppError.MissingId('deleteDeposit')}
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){ throw new AppError.InvalidId('deleteDeposit')}

        const deposit = await Deposit.findById(req.params.id);
        if(!deposit) {throw new AppError.NotFound('deleteDeposit')};
        if(deposit.currentStatus === DepositStatus.PROCESSED){throw new AppError.DepositAlreadyProcessed('deleteDeposit','The deposit has already been processed and cannot be deleted.')}
        if(deposit.contributions.length > 0 || deposit.donations.length > 0) {throw new AppError.DeleteFailed('deleteDeposit', 'The deposit has contributions or donations that must be dealt with first.')}

        await deposit.deleteOne();
        return res.status(200).json('Deposit deleted.');
    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const executeDeposit = async (req, res, next) => {
    try {
        const depositId = req.params.id;
        const responsiblePartyProfileId = req.body.responsiblePartyProfileId;
        if(!depositId){ throw new AppError.MissingId('executeDeposit')}
        if(!responsiblePartyProfileId){ throw new AppError.MissingId('executeDeposit','No profile Id was provided.  The profile of the person executing the deposit is required.')}
        if(!mongoose.Types.ObjectId.isValid(depositId)){ throw new AppError.InvalidId('executeDeposit')}
        if(!mongoose.Types.ObjectId.isValid(responsiblePartyProfileId)){ throw new AppError.InvalidId('executeDeposit','The responsiblePartyProfileId is not a valid ObjectId.')}

        let deposit = await Deposit.findById(depositId);
        if(!deposit) {throw new AppError.NotFound('executeDeposit')};
        if(deposit.currentStatus === DepositStatus.UNALLOCATED){throw new AppError.DepositAlreadyProcessed('executeDeposit','The deposit has already been deposited and is awaiting processing.')}

        deposit.currentStatus = DepositStatus.UNALLOCATED;
        deposit.statusDate = new Date();
        deposit.history.push({status: deposit.currentStatus, date: deposit.statusDate, responsiblePartyProfileId: responsiblePartyProfileId});

        await deposit.save();
        return res.status(200).json(deposit);
    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const processDeposit = async (req, res, next) => {
    try {
        if(!req.params.id){ throw new AppError.MissingId('processDeposit')}
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){ throw new AppError.InvalidId('processDeposit')}

        if(!req.body.approverProfileId) {throw new AppError.MissingId('processDeposit','No profile Id was provided.  The profile of the person approving the deposit is required.')}
        if(!mongoose.Types.ObjectId.isValid(req.body.approverProfileId)){ throw new AppError.InvalidId('processDeposit','The approverProfileId is not a valid ObjectId.')}
        if(await !UserValidation.profileExists(req.body.approverProfileId)){ throw new AppError.NotFound('processDeposit','The provided approverProfileId is not associated with a profile.')}

        let deposit = await Deposit.findById(req.params.id)
            .populate('contributions')
            .populate('donations');
        if(!deposit) {throw new AppError.NotFound('processDeposit')};
        if(deposit.processedDate){throw new AppError.DepositAlreadyProcessed('processDeposit')}

        const depositTotal = deposit.amount
        let contributionTotal = 0;
        let donationTotal = 0;

        if(deposit.contributions.length > 0){
            for (let i = 0; i < deposit.contributions.length; i++) {
                let contributionNet = deposit.contributions[i].net
                contributionTotal += contributionNet
            }
        }

        if(deposit.donations.length > 0){
            for (let i = 0; i < deposit.donations.length; i++) {
                let donationNet = deposit.donations[i].net
                donationTotal += donationNet
            }
        }

        if(depositTotal !== contributionTotal + donationTotal) {throw new AppError.DepositUnbalanced('processDeposit')}

        deposit.approverProfileId = req.body.approverProfileId;
        deposit.currentStatus = DepositStatus.PROCESSED;
        deposit.statusDate = new Date();
        deposit.history.push({status: deposit.currentStatus, date: deposit.statusDate});
        deposit = await deposit.save();

        for(let i = 0; i < deposit.contributions.length; i++){
            deposit.contributions[i].depositId = deposit._id;
            deposit.contributions[i].processedDate = deposit.statusDate;
            await deposit.contributions[i].save();
            await createTransactionsForContributions(deposit.contributions, deposit.approverProfileId);
        }

        for(let i = 0; i < deposit.donations.length; i++){
            deposit.donations[i].depositId = deposit._id;
            deposit.donations[i].processedDate = deposit.statusDate;
            await deposit.donations[i].save();
            await createTransactionsForDonations(deposit.donations, deposit.approverProfileId);
        }

        return res.status(200).json(deposit);
    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const createTransactionsForContributions = async (contributions, responsiblePartyProfileId) => {
    try {
        for (let i = 0; i < contributions.length; i++) {
            let contribution = contributions[i];
            const transaction = await createTransaction(contribution.net, TransactionType.DEPOSIT, contribution.accountId, null, responsiblePartyProfileId);
            if(!transaction){ throw new AppError.TransactionFailed('createTransactionsForContributions','The transaction for the contribution failed to create.')}
        }
    } catch (error) {
        console.log({ method: 'createTransactionsForContributions', message: error.message });
        throw error;
    }
}

const createTransactionsForDonations = async (donations, responsiblePartyProfileId) => {
    try {
        for (let i = 0; i < donations.length; i++) {
            let donation = donations[i];
            const transaction = await createTransaction(donation.amount, TransactionType.DEPOSIT, donation.accountId, null, responsiblePartyProfileId);
            if(!transaction){ throw new AppError.TransactionFailed('createTransactionsForDonations','The transaction for the contribution failed to create.')}
        }
    } catch (error) {
        console.log({ method: 'createTransactionsForContributions', message: error.message });
        throw error;
    }
}

module.exports = {
    createDeposit,
    getAllDeposits,
    getDepositById,
    getDepositsByDateRange,
    updateDeposit,
    deleteDeposit,
    processDeposit,
    executeDeposit,
    getDepositsByStatus
}