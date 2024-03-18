const fs = require('fs');
const csv = require('csv-parser');
const { convertDollarsToPennies, combineDateAndTime } = require('./validationHelper');
const Account = require('../models/accounting/accountModel');
const Contribution = require('../models/accounting/contributionModel');
const JournalEntry = require('../models/accounting/journalModel');
const SubsplashTransaction = require('../models/accounting/subsplashTransactionModel');

//  Parse the Subsplash CSV file
// This process generates a series of SubSplash transactions
function parseSubSplashCSV(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        const csvStream = fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {
                // Fix currency issues
                if (data.transfer_amount) { data.transfer_amount = convertDollarsToPennies(data.transfer_amount); }
                if (data.gross_amount) { data.gross_amount = convertDollarsToPennies(data.gross_amount); }
                if (data.net_amount) { data.net_amount = convertDollarsToPennies(data.net_amount); }
                if (data.fee_amount) { data.fee_amount = convertDollarsToPennies(data.fee_amount); }

                // Fix date and time issues
                if (data.transaction_date && data.transaction_time) { data.transaction_date = combineDateAndTime(data.transaction_date, data.transaction_time); }

                // Fix type to subsplash
                data.type = 'subsplash';

                // Push corrected data into results array
                results.push(data);
            })
            .on('error', reject) // Handle stream errors (e.g., file not found, read errors)
            .on('end', () => {
                resolve(results); // Resolve the promise with the accumulated results once stream ends
            });
    });
}

// Create contributions from SubSplash transactions
function  createContributions(transactionData){

    return Promise.all(transactionData.map(async (transaction) => {
        // Try to find a matching account
        let account = await AccountModel.findOne({ name: transaction.cause }).exec();
        if (!account) {
            // If no account is found, use the default 'Unallocated' account
            account = await AccountModel.findOne({ name: 'Unallocated' }).exec();
        }
        // Create a new contribution
        const newContribution = new Contribution({
            totalAmount: transaction.net_amount,
            transactionDate: transaction.transaction_date,
            depositDate: transaction.transfer_date,
            depositBatchId: transaction.transfer_id,
            type: transaction.type,
        });

        // Save the contribution
        return newContribution.save();
    }));
}

// Generate journal entries

// Generate contribution entries

module.exports = { parseSubSplashCSV };
