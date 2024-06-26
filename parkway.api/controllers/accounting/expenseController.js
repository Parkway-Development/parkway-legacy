const mongoose = require('mongoose');
const Expense = require('../../models/accounting/expenseModel')
const AppError = require('../../applicationErrors')
const ValidationHelper = require('../../helpers/validationHelper');
const {TransactionType, AccountTransactionType} = require('../../models/constants')
const { createTransaction } = require('../../helpers/transactionHelper');

const createExpense = async (req, res, next) =>{
    let result = {expense: null, errors: []};
    try{
        const {amount, payableToProfileId, memo, monetaryInstrument, accountId, transactionType, responsiblePartyId, notes } = req.body;

        if(!amount) throw new AppError.MissingRequiredParameter('createExpense', 'The request body is missing the amount');
        if(!payableToProfileId) throw new AppError.MissingRequiredParameter('createExpense', 'The request body is missing the payableToProfileId');
        if(!monetaryInstrument) throw new AppError.MissingRequiredParameter('createExpense', 'The request body is missing the monetaryInstrument');
        if(!accountId) throw new AppError.MissingRequiredParameter('createExpense', 'The request body is missing the accountId');
        if(!responsiblePartyId) throw new AppError.MissingRequiredParameter('createExpense', 'The request body is missing the responsiblePartyId');
        if(!mongoose.Types.ObjectId.isValid(accountId)) throw new AppError.InvalidObjectId('createExpense', 'The accountId is not a valid ObjectId');
        if(!mongoose.Types.ObjectId.isValid(responsiblePartyId)) throw new AppError.InvalidObjectId('createExpense', 'The responsiblePartyId is not a valid ObjectId');
        if(!ValidationHelper.validateProfileId(payableToProfileId)) throw new AppError.InvalidProfileId('createExpense', 'The payableToProfileId is not a valid profileId');
        if(!ValidationHelper.validateProfileId(responsiblePartyId)) throw new AppError.InvalidProfileId('createExpense', 'The responsiblePartyId is not a valid profileId');

        const accountErrors = await ValidationHelper.validateAccountIds([accountId]);
        if (accountErrors.length > 0) {
            result.errors.push(new AppError.Validation('addContribution', accountErrors.join(', '), 'VALIDATION_ERROR', accountErrors));
        }

        const expense = new Expense({
            amount,
            payableToProfileId,
            memo,
            monetaryInstrument,
            accountId,
            transactionType,
            responsiblePartyId,
            notes
        });

        const validationError = expense.validateSync();
        if(validationError) result.errors.push(new AppError.Validation('createExpense', validationError.message ));

        if(result.errors.length === 0){
            await expense.save({new: true});
            result.expense = expense;

            await createTransaction(expense.amount, TransactionType.EXPENSE, expense.accountId, null, expense.responsiblePartyId );
        }

        return res.status(201).json(expense);
    }
    catch(error){
        next(error)
        console.log({method: error.method, message: error.message});
    }

}

const getExpenses = async (req, res, next) => {
    try{
        const expenses = await Expense.find();
        return res.status(200).json(expenses);
    }
    catch(error){
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const getExpenseById = async (req, res, next) => {
    try{
        const {expenseId} = req.params;
        if(!mongoose.Types.ObjectId.isValid(expenseId)) throw new AppError.InvalidObjectId('getExpense', 'The expenseId is not a valid ObjectId');
        const expense = await Expense.findById(expenseId);
        if(!expense) throw new AppError.NotFound('getExpense', 'The expense was not found');
        return res.status(200).json(expense);
    }
    catch(error){
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const getExpenseByAccountId = async (req, res, next) => {
    try{
        const {expenseId} = req.params;
        if(!mongoose.Types.ObjectId.isValid(accountId)) throw new AppError.InvalidObjectId('getExpense', 'The accountId is not a valid ObjectId');
        if(!ValidationHelper.validateAccountId(accountId)) throw new AppError.InvalidAccountId('getExpense', 'The accountId is not a valid accountId');
        const expenses = await Expense.find({accountId});
        if(!expenses) return res.status(200).json([]);
        return res.status(200).json(expenses);
    }
    catch(error){
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const updateExpense = async (req, res, next) => {
    try{
        const {expenseId} = req.params;
        if(!mongoose.Types.ObjectId.isValid(expenseId)) throw new AppError.InvalidObjectId('updateExpense', 'The expenseId is not a valid ObjectId');
        const expense = await Expense.findById(expenseId);
        if(!expense) throw new AppError.NotFound('updateExpense', 'The expense was not found');
        const {amount, payableToProfileId, memo, monetaryInstrument, accountId, transactionType, responsiblePartyId, notes } = req.body;
        if(amount) expense.amount = amount;
        if(payableToProfileId) expense.payableToProfileId = payableToProfileId;
        if(memo) expense.memo = memo;
        if(monetaryInstrument) expense.monetaryInstrument = monetaryInstrument;
        if(accountId) expense.accountId = accountId;
        if(transactionType) expense.transactionType = transactionType;
        if(responsiblePartyId) expense.responsiblePartyId = responsiblePartyId;
        if(notes) expense.notes = notes;
        await expense.save();
        return res.status(200).json(expense);
    }
    catch(error){
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const deleteExpense = async (req, res, next) => {
    try{
        const {expenseId} = req.params;
        if(!mongoose.Types.ObjectId.isValid(expenseId)) throw new AppError.InvalidObjectId('deleteExpense', 'The expenseId is not a valid ObjectId');
        const expense = await Expense.findById(expenseId);
        if(!expense) throw new AppError.NotFound('deleteExpense', 'The expense was not found');
        await expense.remove();
        return res.status(200).json(expense);
    }
    catch(error){
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

module.exports = {
    createExpense,
    getExpenses,
    getExpenseById,
    getExpenseByAccountId,
    updateExpense,
    deleteExpense
}