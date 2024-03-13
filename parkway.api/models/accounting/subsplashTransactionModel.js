const mongoose = require('mongoose');
const { validateAccountSumMatchesAmount } = require('../helpers/validationHelper');

const subsplashTransactionSchema = new mongoose.Schema({


});

module.exports = mongoose.model('SubSplashTransaction', subsplashTransactionSchema, 'subsplashtransactions')