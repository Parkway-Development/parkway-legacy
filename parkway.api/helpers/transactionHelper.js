const mongoose = require('mongoose');
const Transaction = require('../../models/accounting/transactionModel');
const AppError = require('../../applicationErrors');
const Account = require('../../models/accounting/accountModel');

const createTransaction = async (amount, type, destinationAccountId, sourceAccountId, creatorId) => {
    try {

        if (!amount) {
            throw new AppError.MissingRequiredParameter('createTransaction', 'No amount was provided. You cannot have a $0 transaction.');
        }
        if (!type) {
            throw new AppError.MissingRequiredParameter('createTransaction', 'No type was provided. You must provide a type for the transaction. Allowed types are transfer, deposit, withdrawal, adjustment, or reversal.');
        }
        if (!destinationAccountId) {
            throw new AppError.MissingRequiredParameter('createTransaction', 'The destination account was not provided. You must provide a destination account for the transaction.');
        }
        if (type === 'transfer' && (!sourceAccountId)) {
            throw new AppError.MissingRequiredParameter('createTransaction', 'The attempted transfer was not possible because no source account was provided. You must provide a source account for all transfers.');
        }
        if (!creatorId) {
            throw new AppError.MissingId('createTransaction');
        }
        if (!mongoose.Types.ObjectId.isValid(creatorId)) {
            throw new AppError.InvalidId('createTransaction');
        }

        let transaction;

        switch(type){
            case 'transfer':
                transaction = createTransfer(amount, destinationAccountId, sourceAccountId, creatorId);
                break;
            case 'deposit':
                break;
            case 'withdrawal':
                break;
            case 'adjustment':
                break;
            case 'reversal':
                break;
            default:
        }

        if(!transaction) { throw new AppError.NotFound('createTransaction', 'The transaction could not be created.'); }

        const validationError = transaction.validateSync();
        if (validationError) {  throw new AppError.Validation('createTransaction', validationError.message); }

        await transaction.save({ new: true});

        await adjustBalances(transaction.toAccount, transaction.fromAccount, transaction.amount);

        return res.status(201).json(transaction);

    } catch (error) {
        console.log({ method: error.method, message: error.message });
        next(error);
    }
};

const createTransfer = async (amount, destinationAccountId, sourceAccountId, creatorId) => {
    try {
        const transaction = new Transaction(amount, 'transfer', destinationAccountId, sourceAccountId, creatorId);

        const destinationAccount = await Account.findById(destinationAccountId);
        if (!destinationAccount) { throw new AppError.NotFound('createTransaction', 'The destination account could not be found'); }
        if (destinationAccount.type === 'asset' || destinationAccount.type === 'expense') { destinationAccount.type = 'debit'; }
        else { destinationAccount.type = 'credit'; }

        const sourceAccount = await Account.findById(sourceAccountId);
        if (!sourceAccount) { throw new AppError.NotFound('createTransaction', 'The source account could not be found'); }
        if (sourceAccount.type === 'asset' || sourceAccount.type === 'expense') { sourceAccount.type = 'credit'; } 
        else { sourceAccount.type = 'debit'; }

        return transaction;
    } catch (error) {
        console.log({ method: error.method, message: error.message });
        next(error);
    }
};

// const createDeposit = async (amount, destinationAccountId, creatorId) => {
//     try {
//         //TODO: The Unallocated account should be found in a client based setting in platform settings
//         const sourceAccount = await Account.findOne({ name: 'Unallocated' });
//         if (!sourceAccount) { throw new AppError.NotFound('createTransaction', 'The source account Unallocated could not be found'); }
        
//         const transaction = new Transaction(amount, 'deposit', destinationAccountId, null, creatorId);

//         const destinationAccount = await Account.findById(destinationAccountId);
//         if (!destinationAccount) { throw new AppError.NotFound('createTransaction', 'The destination account could not be found'); }
//         if (destinationAccount.type === 'asset' || destinationAccount.type === 'expense') { destinationAccount.type = 'debit'; }
//         else { destinationAccount.type = 'credit'; }

//         return transaction;
//     }
//     catch (error) {
//         console.log({ method: error.method, message: error.message });
//         next(error);
//     }
// };

const adjustBalances = async (destinationAccount, sourceAccount, amount) => {
    try {
        if (destinationAccount.type === 'debit') {
            await Account.findByIdAndUpdate(destinationAccount.accountId, { $inc: { balance: amount } });
        } else {
            await Account.findByIdAndUpdate(destinationAccount.accountId, { $inc: { balance: -amount } });
        }

        if (fromAccount.type === 'debit') {
            await Account.findByIdAndUpdate(sourceAccount.accountId, { $inc: { balance: -amount } });
        } else {
            await Account.findByIdAndUpdate(sourceAccount.accountId, { $inc: { balance: amount } });
        }
    } catch (error) {
        console.log({ method: error.method, message: error.message });
        next(error);
    }
};

module.exports = createTransaction, createTransfer, adjustBalances;
