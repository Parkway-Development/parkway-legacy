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
}


module.exports = {
    sanitizeString: ValidationHelper.sanitizeString,
    validateAccountSumMatchesAmount: ValidationHelper.validateAccountSumMatchesAmount,
    combineDateAndTime: ValidationHelper.combineDateAndTime,
};

