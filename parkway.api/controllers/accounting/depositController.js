const mongoose = require('mongoose')
const Deposit = require('../../models/accounting/depositModel')
const AppError = require('../../applicationErrors')

const addDeposit = async (req, res, next) => {
        try {
        if(!req.body){throw new AppError.RequestBodyMissing('addDeposit')};

        const deposit = new Deposit(req.body);

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

        await deposit.deleteOne();
        return res.status(200).json('Deposit deleted.');
    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const processDeposit = async (req, res, next) => {
    try {
        if(!req.params.id){ throw new AppError.MissingId('processDeposit')}
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){ throw new AppError.InvalidId('processDeposit')}

        const approverId = req.body
        if(!approverId) {throw new AppError.IdMissing('processDeposit')}

        const deposit = await Deposit.findById(req.params.id);
        if(!deposit) {throw new AppError.NotFound('processDeposit')};

        const total = deposit.total
        const contributionTotal = 0;

        for (let i = 0; i < deposit.contributions.length; i++) {
            contributionTotal += deposit.contributions[i].amount
        }

        if(!total === contributionTotal) {throw new AppError.DepositUnbalanced('processDeposit')}

        deposit.approverId = approverId;
        deposit = await deposit.save();

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
    processDeposit
}