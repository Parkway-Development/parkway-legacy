const mongoose = require('mongoose');
const Account = require('../models/accounting/accountModel');
const Profile = require('../models/profileModel');
const Organization = require('../models/organizationModel');
const AppError = require('../applicationErrors');
class ValidationHelper {

    static sanitizeString(str) {
        return str.replace(/\s+/g, ' ').trim();
    }
    
    static validateAccountSumMatchesAmount = (net, accounts) => {
        const sumOfAccounts = accounts.reduce((sum, record) => sum + record.amount, 0);
        return net === sumOfAccounts;
    };

    static combineDateAndTime(date, time) {
        let fullDateTime = `${date} ${time}`;
        return new Date(fullDateTime);
    };

    static validateAccountIds = async (accounts, isDonation) => {
        let errors = [];

        if(accounts.length === 0) {
            errors.push('No accounts were provided'); 
            return errors;
        }
        if(isDonation === null){
            errors.push('isDonation is required');
            return errors;
        }

        for (let i = 0; i < accounts.length; i++) {
            const accountId = accounts[i].accountId;
            const response = await this.validateAccountId(accountId, isDonation);
            if(response.result === false) { errors.push(result.message) }
        }

        return errors;
    }

    static validateAccountId = async (accountId) => {
        if (!mongoose.Types.ObjectId.isValid(accountId)) { return ({message: `Invalid account Id: ${accountId}`, result: false}) }
        
        const account = await Account.findById(accountId);
        if (!account) { return ({message: `Account does not exist for Id: ${accountId}`, result: false})}

        return ({message: `Account found Id: ${accountId}`, result: true})    
    }

    static validateProfileIds = async (profiles) => {
        let errors = [];
        for (let i = 0; i < profiles.length; i++) {
            const profileId = profiles[i].profileId;
            const response = await this.validateProfileId(profileId);
            if(response.result === false) { errors.push(result.message) }
        }

        return errors;
    }

    static validateProfileId = async (profileId) => {
        if (!mongoose.Types.ObjectId.isValid(profileId)) { return ({message: `Invalid profile Id: ${profileId}`, result: false}) }
           
        const profile = await Profile.findById(profileId);
        if (!profile) { return ({message: `Profile does not exist for Id: ${profileId}`, result: false})}

        return ({message: `Profile found Id: ${profileId}`, result: true})    
    }

    static checkDateOrder(startDate, endDate) {
        let start = new Date(startDate);
        let end = new Date(endDate);
        return start < end;
    }

    static async checkDuplicateAccount(accountName, accountType) {
        const account = await Account.findOne({ name: accountName, type: accountType });
        return !!account;
    }
}


module.exports = {
    sanitizeString: ValidationHelper.sanitizeString,
    validateAccountSumMatchesAmount: ValidationHelper.validateAccountSumMatchesAmount,
    combineDateAndTime: ValidationHelper.combineDateAndTime,
    checkDateOrder: ValidationHelper.checkDateOrder,
    validateAccountIds: ValidationHelper.validateAccountIds,
    validateAccountId: ValidationHelper.validateAccountId,
    validateProfileIds: ValidationHelper.validateProfileIds,
    validateProfileId: ValidationHelper.validateProfileId,
    checkDuplicateAccount: ValidationHelper.checkDuplicateAccount
};

