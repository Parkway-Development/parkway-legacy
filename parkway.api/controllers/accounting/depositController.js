const mongoose = require('mongoose')
const Deposit = require('../../models/accounting/depositModel')
const AppError = require('../../applicationErrors')
const ValidationHelper = require('../../helpers/validationHelper')
const UserValidation = require('../../helpers/userValidation')
const {DepositStatus} = require('../../models/constants')

const addDeposit = async (req, res, next) => {
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
        const deposits = await Deposit.find({});

        if(deposits.length === 0){ return res.status(200).json('No deposits found.'); }

        return res.status(200).json(deposits);

    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const getDepositById = async (req, res, next) => {
    try {
        if(!req.params.id){ throw new AppError.MissingId('getDepositById')}
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){ throw new AppError.InvalidId('getDepositById')}

        const deposit = await Deposit.findById(req.params.id)
            .populate('contributions');

        if(!deposit){ return res.status(200).json('No deposit found for that Id.')}
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
            if(deposits.length === 0){ return res.status(200).json('No deposits found for that status.')}
        }else{
            if(!ValidationHelper.checkDateOrder(startDate, endDate)){ throw new AppError.InvalidDateRange('getDepositByStatus')}
            deposits = await Deposit.find({
                currentStatus: status,
                statusDate: {
                    $gte: new Date(startDate).toISOString(),
                    $lte: new Date(endDate).toISOString()
                }
            }).sort({ statusDate: 1});
            if(deposits.length === 0){ return res.status(200).json('No deposits found for that status and date range.')}
        }

        return res.status(200).json(deposits);
    }
    catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const getPopulatedDepositById = async (req, res, next) => {
    try {
        if(!req.params.id){ throw new AppError.MissingId('getPopulatedDepositById')}
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){ throw new AppError.InvalidId('getPopulatedDepositById')}

        const deposit = await Deposit.findById(req.params.id)
            .populate({
                path: 'contributions',
            populate:[
                {
                    path: 'accounts.account',
                    model: 'Account'
                },
                {
                    path: 'profile',
                    model: 'Profile'
                }
            ]});

        if(!deposit){ return res.status(200).json('No deposit found for that Id.')}
        return res.status(200).json(deposit);
    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const getDepositsByDateRange = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        if(!startDate || !endDate){ throw new AppError.MissingDateRange('getDepositsByDateRange')}
        if(!ValidationHelper.checkDateOrder(startDate, endDate)){ throw new AppError.InvalidDateRange('getContributionsByDateRange')}

        const deposits = await Deposit.find({
            date: {
                $gte: new Date(startDate).toISOString(),
                $lte: new Date(endDate).toISOString()
            }
        }).sort({ date: 1});

        if(deposits.length === 0){ return res.status(200).json('No deposits found for that date range.')}
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
        if(deposit.processedDate){throw new AppError.DeleteFailed('updateDeposit', 'The deposit has already been processed and cannot be modified.')}

        Object.keys(req.body).forEach(key => {
            deposit[key] = req.body[key];
        });

        const validationError = deposit.validateSync();
        if (validationError) { throw new AppError.Validation('updateDeposit') }

        await deposit.save();
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
        if(deposit.processedDate){throw new AppError.DeleteFailed('deleteDeposit', 'The deposit has already been processed and cannot be deleted.')}
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
        deposit.currentStatus = 'PROCESSED';
        deposit.statusDate = new Date();
        deposit.history.push({status: deposit.currentStatus, date: deposit.statusDate});
        deposit = await deposit.save();

        for(let i = 0; i < deposit.contributions.length; i++){
            deposit.contributions[i].depositId = deposit._id;
            deposit.contributions[i].processedDate = deposit.statusDate;
            await deposit.contributions[i].save();
        }

        return res.status(200).json(deposit);
    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

module.exports = {
    addDeposit,
    getAllDeposits,
    getDepositById,
    getPopulatedDepositById,
    getDepositsByDateRange,
    updateDeposit,
    deleteDeposit,
    processDeposit,
    executeDeposit,
    getDepositsByStatus
}