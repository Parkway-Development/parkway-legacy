const mongoose = require('mongoose');
const SubsplashTransaction = require('../models/accounting/subsplashTransactionModel');
const Contribution = require('../models/accounting/contributionModel');
const JournalEntry = require('../models/accounting/journalModel');
const { parseSubSplashCSV } = require('../helpers/parsers');
const fs = require('fs');
const csv = require('csv-parser');

const uploadSubsplashTransferFile = async (req, res) => {
    try {

        // Parse the CSV file
        const parsedData = await parseSubSplashCSV(req.file.path);

        // Insert the parsed data into the database for subsplash transactions
        await SubsplashTransaction.insertMany(parsedData);

        // Create Donations and insert them into the database under donations
        const contributionData = await CreateDonations(parsedData);
        await Contribution.insertMany(contributionData);

        // Create Journal Entries and insert them into the database under journal entries
        const journalEntryData = await CreateJournalEntries(contributionData);
        await JournalEntry.insertMany(journalEntryData);

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