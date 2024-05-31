const mongoose = require('mongoose');
const Transaction = require('../models/accounting/transactionModel');
const AppError = require('../applicationErrors');
const Account = require('../models/accounting/accountModel');
const Validation = require('../helpers/validationHelper');
const { AccountTransactionType, TransactionType } = require('../models/constants');

const createTransaction = async (amount, type, destinationAccountId = null, sourceAccountId = null, responsiblePartyId) => {
    try {
        if (!amount) { throw new AppError.MissingRequiredParameter('createTransaction', 'Missing amount'); }
        if (!type) { throw new AppError.MissingRequiredParameter('createTransaction', 'Missing type'); }

        if (!responsiblePartyId) { throw new AppError.MissingId('createTransaction'); }
        if (!mongoose.Types.ObjectId.isValid(responsiblePartyId)) { throw new AppError.InvalidId('createTransaction'); }
        if (!Validation.validateProfileId(responsiblePartyId)) { throw new AppError.ProfileDoesNotExist('createTransaction', 'The responsible party does not exist'); }

        let transaction;
        switch (type) {
            case TransactionType.TRANSFER:
                if (!destinationAccountId || !sourceAccountId) { throw new AppError.MissingRequiredParameter('createTransaction', 'Missing destination or source account Id'); }
                if (!mongoose.Types.ObjectId.isValid(destinationAccountId) || !mongoose.Types.ObjectId.isValid(sourceAccountId)) { throw new AppError.InvalidId('createTransaction', 'The destination or source account Id is invalid'); }
                transaction = await createTransferTransaction(amount, destinationAccountId, sourceAccountId, responsiblePartyId);
                await adjustBalances(transaction);
                break;
            case TransactionType.DEPOSIT:
                if (!destinationAccountId) { throw new AppError.MissingRequiredParameter('createTransaction', 'Missing destination Id'); }
                if (!mongoose.Types.ObjectId.isValid(destinationAccountId)) { throw new AppError.InvalidId('createTransaction', 'The destination Id is invalid'); }
                transaction = await createDepositTransaction(amount, destinationAccountId, responsiblePartyId);
                await adjustBalances(transaction);
                break;
            case TransactionType.WITHDRAWAL:
                throw new Error('Not Implemented');
                break;
            case TransactionType.ADJUSTMENT:
                throw new Error('Not Implemented');
                break;
            case TransactionType.REVERSAL:
                throw new Error('Not Implemented');
                break;
            default:
                throw new AppError.InvalidType('createTransaction', 'Invalid transaction type');
        }

        return transaction;

    } catch (error) {
        console.log({ method: error.method, message: error.message });
        throw error;
    }
};

const determineTransactionTypeForAccount = (account, increaseFunds = true) => {
    if (increaseFunds) {
        if (account.type === 'asset' || account.type === 'expense' || account.type === 'cash') { return 'debit'; }
        else { return 'credit'; }
    } else {
        if (account.type === 'asset' || account.type === 'expense' || account.type === 'cash') { return 'credit'; }
        else { return 'debit'; }
    }
};

const adjustBalances = async (transaction) => {
    try {
        if(transaction.destinationAccount) {
            const destinationAccount = Account.findById(transaction.destinationAccount.accountId);
            if((destinationAccount.type === 'expense' || destinationAccount.type === 'asset' || destinationAccount.type === 'cash') && transaction.destinationAccount.type === 'debit') {
                await Account.findByIdAndUpdate(destinationAccount.accountId, { $inc: { balance: transaction.amount } });
            } else {
                await Account.findByIdAndUpdate(destinationAccount.accountId, { $inc: { balance: -transaction.amount } });
            }
        }

        if(transaction.sourceAccount) {
            const sourceAccount = Account.findById(transaction.sourceAccount.accountId);
            if((sourceAccount.type === 'expense' || sourceAccount.type === 'asset' || sourceAccount.type === 'cash') && transaction.sourceAccount.type === 'debit') {
                await Account.findByIdAndUpdate(sourceAccount.accountId, { $inc: { balance: -transaction.amount } });
            } else {
                await Account.findByIdAndUpdate(sourceAccount.accountId, { $inc: { balance: transaction.amount } });
            }
        }
    } catch (error) {
        console.log({ method: error.method, message: error.message });
        throw error;
    }
};

const createTransferTransaction = async (amount, destinationAccountId, sourceAccountId, responsiblePartyId) => {
    try {
        let transaction = new Transaction({ amount, type: 'transfer', responsiblePartyId });

        const destinationAccount = await Account.findById(destinationAccountId);
        if (!destinationAccount) { throw new AppError.NotFound('createTransaction', 'The destination account could not be found'); }

        const destinationAccountDetail = {
            accountId: destinationAccountId,
            type: determineTransactionTypeForAccount('transfer', destinationAccount, true)
        };
        transaction.destinationAccount = destinationAccountDetail;

        const sourceAccount = await Account.findById(sourceAccountId);
        if (!sourceAccount) { throw new AppError.NotFound('createTransfer', 'The source account could not be found'); }

        const sourceAccountDetail = {
            accountId: sourceAccountId,
            type: determineTransactionTypeForAccount('transfer', sourceAccount, false)
        };
        transaction.sourceAccount = sourceAccountDetail;

        return transaction;

    } catch (error) {
        console.log({ method: error.method, message: error.message });
        throw error;
    }
};

const createDepositTransaction = async (amount, destinationAccountId, responsiblePartyId) => {
    try {
        let transaction = new Transaction({ amount, type: 'deposit', responsiblePartyId });

        const destinationAccount = await Account.findById(destinationAccountId);
        if (!destinationAccount) { throw new AppError.NotFound('createDeposit', 'The destination account could not be found'); }

        const destinationAccountDetail = {
            accountId: destinationAccountId,
            type: determineTransactionTypeForAccount('deposit', destinationAccount, true)
        };
        transaction.destinationAccount = destinationAccountDetail;

        return transaction;
    }
    catch (error) {
        console.log({ method: error.method, message: error.message });
        throw error;
    }
};


module.exports = {
    createTransaction
};
