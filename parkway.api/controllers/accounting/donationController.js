const mongoose = require('mongoose');
const Donation = require('../../models/accounting/donationModel');
const ValidationHelper = require('../../helpers/validationHelper');
const appError = require('../../applicationErrors');
const Organization = require('../../models/organizationModel');
const User = require('../../models/userModel');
const jwt = require('jsonwebtoken');
const titheAccountId = '664cee912f4c2fc061ce5c98'
const titheOfTithesAccountId = '664cfb958f28a61f59decfdb'

const createDonation = async (req, res, next) => {
    try {
        const { description, value, donorProfileId, accounts, notes } = req.body;

        if (!description) { throw new appError.MissingRequiredParameter('addDonation'); }
        if (donorProfileId) {
            const profileValid = await ValidationHelper.validateProfileId(donorProfileId);
            if (!profileValid.result) { throw new appError.ProfileDoesNotExist('addDonation', profileValid.message); }
        }

        if (accounts) {
            let accountTotal = 0;
            for (let i = 0; i < accounts.length; i++) {
                
                if(accounts[i].accountId === titheAccountId ){ throw new appError.Validation('addDonation', 'Donations cannot be tithes'); }
                if(accounts[i].accountId === titheOfTithesAccountId ){ throw new appError.Validation('addDonation', 'Tithe of '); }

                const accountValid = await ValidationHelper.validateAccountId(accounts[i].accountId);
                if (!accountValid.result) { throw new appError.AccountDoesNotExist('addDonation', accountValid.message); }
                accountTotal += accounts[i].amount;
            }

            if (accountTotal !== value) { throw new appError.Validation('addDonation', 'The sum of the accounts does not equal the value of the donation'); }
        }

        const donation = new Donation({ description, value, donorProfileId, accounts, notes });

        const validationError = donation.validateSync();
        if (validationError) { throw new appError.Validation(validationError.message); }

        await donation.save();
        // TODO: If there are accounts and values, update account balances and create a transaction
        return res.status(201).json(donation);
    } catch (error) {
        console.log({ method: error.method, message: error.message });
        next(error);
    }
};

const getAllDonations = async (req, res, next) => {
    try {
        let donations;
        if (req.query.populate === 'true') {
            donations = await Donation.find().populate('donorProfileId accounts.accountId');
        } else {
            donations = await Deposit.find();
        }

        if (donations.length === 0) { return res.status(204).json({ message: "No donations found." }); }

        return res.status(200).json(donations);
    } catch (error) {
        console.log({ method: 'getAllDeposits', message: error.message });
        next(error);
    }
};

const getDonationsByDateRange = async (req, res, next) => {
    try {
        const { startDate, endDate, populate } = req.query;
        let donations;
        if (startDate && endDate) {
            if (!ValidationHelper.checkDateOrder(startDate, endDate)) { throw new appError.InvalidDateRange('getAllDonations'); }
            donations = await Donation.find({ date: { $gte: startDate, $lte: endDate } }).sort({ date: -1 });
            if (donations.length === 0) { throw new appError.NotFound('getAllDonations', 'No donations found for the specified date range.'); }
        } else {
            donations = await Donation.find().sort({ date: -1 });
            if (donations.length === 0) { throw new appError.NotFound('getAllDonations'); }
        }

        if (populate === 'true') {
            await donations.populate('donorProfile accounts').execPopulate();
        }

        return res.status(200).json(donations);
    } catch (error) {
        console.log({ method: error.method, message: error.message });
        next(error);
    }
};

const getDonationById = async (req, res, next) => {
    try {
        const { populate } = req.query;
        if (!req.params.id) { throw new appError.MissingId('getDonationById'); }
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) { throw new appError.InvalidId('getDonationById'); }

        let donation;
        if (populate === 'true') {
            donation = await Donation.findById(req.params.id).populate('donorProfileId accounts.accountId');
        } else {
            donation = await Donation.findById(req.params.id);
        }

        if (!donation) { throw new appError.DonationDoesNotExist('getDonationById'); }

        return res.status(200).json(donation);
    } catch (error) {
        console.log({ method: error.method, message: error.message });
        next(error);
    }
};

const getDonationsByProfile = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;

        if (!req.params.donorProfileId) { throw new appError.MissingId('getDonationsByProfile'); }
        if (!mongoose.Types.ObjectId.isValid(req.params.donorProfileId)) { throw new appError.InvalidId('getDonationsByProfile'); }
        if (!await ValidationHelper.validateId(req.params.donorProfileId)) { throw new appError.ProfileDoesNotExist('getDonationsByProfile'); }

        const donorProfileId = req.params.donorProfileId;
        let donations;
        if (startDate && endDate) {
            if (!ValidationHelper.checkDateOrder(startDate, endDate)) { throw new appError.InvalidDateRange('getDonationsByProfile'); }
            donations = await Donation.find({ donorProfileId: donorProfileId, date: { $gte: startDate, $lte: endDate } }).sort({ date: -1 });
            if (donations.length === 0) { throw new appError.NotFound('getDonationsByProfile', 'No donations found for the specified date range in the specified profile.');}
        } else {
            donations = await Donation.find({ donorProfileId: donorProfileId }).sort({ date: -1 });
            if (donations.length === 0) { throw new appError.NotFound('getDonationsByProfile', `No donations were found for donorProfileId ${donorProfileId}`);}
        }

        return res.status(200).json(donations);
    } catch (error) {
        console.log({ method: error.method, message: error.message });
        next(error);
    }
};

const updateDonation = async (req, res, next) => {
    try {
        const { populate } = req.query;
        if (!req.params.donationId) { throw new appError.MissingId('updateDonation'); }
        if (!mongoose.Types.ObjectId.isValid(req.params.donationId)) { throw new appError.InvalidId('updateDonation'); }

        const donation = await Donation.findByIdAndUpdate(req.params.donationId, req.body, { new: true, runValidators: true });
        if (!donation) { return res.status(404).json({ error: "The update failed." }); }

        if (populate === 'true') {
            await donation.populate('donorProfile accounts').execPopulate();
        }

        return res.status(200).json(donation);
    } catch (error) {
        console.log({ method: error.method, message: error.message });
        next(error);
    }
};

const deleteDonation = async (req, res, next) => {
    try {
        if (!req.params.id) { return res.status(400).json({ error: 'No Donation ID provided.' }); }
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) { throw new appError.InvalidId('deleteDonation'); }

        const donation = await Donation.findByIdAndDelete(req.params.id);
        if (!donation) { return res.status(404).json({ message: "Donation could not be found. Donation was not deleted." }); }
        return res.status(200).json({ message: `Donation ${donation._id} was deleted.`, donation });
    } catch (error) {
        console.log({ method: error.method, message: error.message });
        next(error);
    }
};

module.exports = {
    createDonation,
    getAllDonations,
    getDonationsByDateRange,
    getDonationById,
    getDonationsByProfile,
    updateDonation,
    deleteDonation
};
