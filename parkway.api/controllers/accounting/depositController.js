const mongoose = require('mongoose')
const Deposit = require('../../models/accounting/depositModel')

const addDeposit = async (req, res) => {
        try {
        if(!req.body){throw new Error('No deposit data provided.')};

        const deposit = new Deposit(req.body);

        const validationError = deposit.validateSync();
        if (validationError) { throw new Error({ error: validationError.message }) }

        await deposit.save();
        return res.status(201).json(deposit);

    } catch (error) {
        console.log(error.message);
        return res.status(500).json(error.message);

    }
}

const getAllDeposits = async (req, res) => {

    try {
        const deposits = await Deposit.find({});
        if(deposits.length === 0) { throw new Error('No deposits were returned.')}
        return res.status(200).json(deposits);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json(error.message);
    }
}

//TODO: Add Date range

const getDepositById = async (req, res) => {
    try {
        if(!req.params.id){ throw new Error('No Deposit ID provided.')}
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){ throw new Error('Invalid ID.')}

        const deposit = await Deposit.findById(req.params.id)
            .populate('contributions');
        if(!deposit) {throw new Error('Deposit not found.')};

        return res.status(200).json(deposit);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json(error.message);
    }
}

const getPopulatedDepositById = async (req, res) => {
    try {
        if(!req.params.id){ throw new Error('No Deposit ID provided.')}
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){ throw new Error('Invalid ID.')}

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
        if(!deposit) {throw new Error('Deposit not found.')};

        return res.status(200).json(deposit);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json(error.message);
    }
}

const updateDeposit = async (req, res) => {
    try {
        if(!req.params.id){ throw new Error('No Deposit ID provided.')}
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){ throw new Error('Invalid ID.')}

        const deposit = await Deposit.findById(req.params.id);
        if(!deposit) {throw new Error('Deposit not found.')};

        Object.keys(req.body).forEach(key => {
            deposit[key] = req.body[key];
        });

        const validationError = deposit.validateSync();
        if (validationError) { throw new Error({ error: validationError.message }) }

        await deposit.save();
        return res.status(200).json(deposit);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json(error.message);
    }
}

const deleteDeposit = async (req, res) => {
    try {
        if(!req.params.id){ throw new Error('No Deposit ID provided.')}
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){ throw new Error('Invalid ID.')}

        const deposit = await Deposit.findById(req.params.id);
        if(!deposit) {throw new Error('Deposit not found.')};

        await deposit.deleteOne();
        return res.status(200).json('Deposit deleted.');
    } catch (error) {
        console.log(error.message);
        return res.status(500).json(error.message);
    }
}

const processDeposit = async (req, res) => {
    try {
        if(!req.params.id){ throw new Error('No Deposit ID provided.')}
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){ throw new Error('Invalid ID.')}

        const approverId = req.body
        if(!approverId) {throw new Error('No approver ID provided.')}

        const deposit = await Deposit.findById(req.params.id);
        if(!deposit) {throw new Error('Deposit not found.')};

        const total = deposit.total
        const contributionTotal = 0;

        for (let i = 0; i < deposit.contributions.length; i++) {
            contributionTotal += deposit.contributions[i].amount
        }

        if(!total === contributionTotal) {throw new Error('Deposit total does not match contribution total.')}

        deposit.approverId = approverId;
        deposit = await deposit.save();

        return res.status(200).json(deposit);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json(error.message);
    }
}

module.exports = {
    addDeposit,
    getAllDeposits,
    getDepositById,
    getPopulatedDepositById,
    updateDeposit,
    deleteDeposit,
    processDeposit
}