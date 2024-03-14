const mongoose = require('mongoose');
const SubsplashTransaction = require('../models/accounting/subsplashTransactionModel');
const{ convertDollarsToPennies, combineDateAndTime } = require('../helpers/validationHelper');

const fs = require('fs');
const csv = require('csv-parser');

// A function to read and parse the CSV file, returning a promise that resolves to an array of objects.
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
                if (data.transaction_date && data.transaction_time) { 
                    data.transaction_date = combineDateAndTime(data.transaction_date, data.transaction_time); 
                }

                // Push corrected data into results array
                results.push(data);
            })
            .on('error', reject) // Handle stream errors (e.g., file not found, read errors)
            .on('end', () => {
                resolve(results); // Resolve the promise with the accumulated results once stream ends
            });
    });
}



const uploadSubsplashTransferFile = async (req, res) => {
    try {

        // Parse the CSV file
        const parsedData = await parseSubSplashCSV(req.file.path);

        // Insert the parsed data into the database
        await SubsplashTransaction.insertMany(parsedData);
        
        // Send a success response
        res.json({ message: 'CSV data successfully uploaded and saved.' });
    } catch (error) {
        // Handle any errors
        res.status(500).json({message: 'Error processing file: ' + error.message});
    }
};

module.exports = {
    uploadSubsplashTransferFile
};