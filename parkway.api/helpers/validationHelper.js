const mongoose = require('mongoose');
class ValidationHelper {
    // Method to remove extra spaces from strings
    static sanitizeString(str) {
        return str.replace(/\s+/g, ' ').trim();
    }
    
    // Validate the id is a valid mongoose id
    static validateId(id) {
        return mongoose.Types.ObjectId.isValid(id);
    }

    static async validateAccountIds(accountIds) {
        const AccountModel = require( '../models/accounting/accountModel');
        let errors = [];

        for (const accountId of accountIds) {
            if (!ValidationHelper.validateId(accountId)) {
                errors.push(`Account ID ${accountId} is not a valid ObjectId.`);
                continue;
            }

            // Validate if the ID exists in the database
            try {
                const accountDoc = await AccountModel.findById(accountId);
                if (!accountDoc) {
                    errors.push(`Account with ID ${accountId} does not exist.`);
                }
            } catch (error) {
                errors.push(`Error validating account ID ${accountId}: ${error.message}`);
            }
        }

        return errors.length > 0 ? errors : null;
    }
}

module.exports = ValidationHelper;
