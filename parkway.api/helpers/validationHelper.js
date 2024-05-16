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

    static validateAccountIds = async (accountId) => {
        let errors = [];
        for (let i = 0; i < accountId.length; i++) {
            if (!mongoose.Types.ObjectId.isValid(accountId[i])) { errors.push(`Invalid account id: ${accountId[i]}`) }
            
            const account = await Account.findById(accountId[i]);
            if (!account) { errors.push(`Account not found: ${accountId[i]}`) }
        }

        return errors;
    }

    static checkDateOrder(startDate, endDate) {
        let start = new Date(startDate);
        let end = new Date(endDate);
        return start < end;
    }
}


module.exports = {
    sanitizeString: ValidationHelper.sanitizeString,
    validateAccountSumMatchesAmount: ValidationHelper.validateAccountSumMatchesAmount,
    combineDateAndTime: ValidationHelper.combineDateAndTime,
    checkDateOrder: ValidationHelper.checkDateOrder,
    validateAccountIds: ValidationHelper.validateAccountIds
};

