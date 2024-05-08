const mongoose = require('mongoose');
const Account = require('../models/accounting/accountModel');
class ValidationHelper {
    // Method to remove extra spaces from strings
    static sanitizeString(str) {
        return str.replace(/\s+/g, ' ').trim();
    }
    
    // Validate the account ids are actual account ids
    static async validateAccountIds(accountIds) {
        try {
            const AccountModel = require( '../models/accounting/accountModel');
            let errors = [];

            for (const accountId of accountIds) {
                if (!mongoose.Types.ObjectId.isValid(accountId)) {
                    errors.push(`Account ID ${accountId} is not a valid ObjectId.`);
                    continue;
                }

                // Validate if the ID exists in the database
                const account = await Account.findById(_id = accountId);
                if (!account) {
                    errors.push(`Account with ID ${accountId} does not exist.`);
                }
            }
            return errors.length > 0 ? errors : null;
        } catch (error) {
            console.log(error.message);
            return { message: error.message };
        }
    }

    // Validate the sum of the amounts going to the accounts equals the total amount
    static validateAccountSumMatchesAmount = (totalAmount, accounts) => {
        const sumOfAccounts = accounts.reduce((sum, record) => sum + record.amount, 0);
        return totalAmount === sumOfAccounts;
    };

    // Convert all financial amounts to pennies for storage
    static convertDollarsToPennies(dollarString) {
        // Remove commas, parse the float value, and convert to pennies
        const amountInDollars = parseFloat(dollarString.replace(/,/g, ''));
        const amountInPennies = Math.round(amountInDollars * 100);
        return amountInPennies;
    };

    static combineDateAndTime(date, time) {
        let fullDateTime = `${date} ${time}`;
        return new Date(fullDateTime);
    };
}


module.exports = {
    sanitizeString: ValidationHelper.sanitizeString,
    validateId: ValidationHelper.validateId,
    validateAccountIds: ValidationHelper.validateAccountIds,
    validateAccountSumMatchesAmount: ValidationHelper.validateAccountSumMatchesAmount,
    convertDollarsToPennies: ValidationHelper.convertDollarsToPennies,
    combineDateAndTime: ValidationHelper.combineDateAndTime
};

