const mongoose = require('mongoose');
const Account = require('../models/accounting/accountModel');
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

    static validateAccountIds = async (accounts) => {
        let errors = [];
        for (let i = 0; i < accounts.length; i++) {
            const accountId = accounts[i].accountId;
            const response = await this.validateAccountId(accountId);
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
    checkDuplicateAccount: ValidationHelper.checkDuplicateAccount
};

