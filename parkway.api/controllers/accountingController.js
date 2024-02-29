const mongoose = require('mongoose');
const Donation = require('../models/donationModel');
const Pledge = require('../models/pledgeModel');
const Vendor = require('../models/vendorModel');
const Expense = require('../models/expenseModel');
const Payroll = require('../models/payrollModel');
const Fund = require('../models/fundModel');
const Budget = require('../models/budgetModel');
const Asset = require('../models/assetModel');

//Donations
//Post a donation
const addDonation = async (req, res) => {
    const donation = new Donation({
        amount: req.body.amount,
        date: req.body.date,
        type: req.body.type,
        fund: req.body.fund,
        profileId: req.body.profileId
    })

    const donationToSave = await donation.save();

    if(!donationToSave){
    return res.status(404).json({mssg: "The save failed."})}

    res.status(200).json(donationToSave)
}

//Get all donations
const getAllDonations = async (req, res) => {
    const donations = await Donation.find({}).sort({date: -1});
    if(!donations){
        return res.status(404).json({mssg: "No donations were returned."})
    }
    res.status(200).json(donations)
}

//Get donation by ID
const getDonationById = async (req, res) => {

    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such donation.'})
    }
    const donation = await Donation.findById(id);

    if(!donation){
        return res.status(404).json({mssg: "No such donation found."})
    }
        
    res.status(200).json(donation)
}

//Get donations by profile
const getDonationsByProfile = async (req, res) => {
    const donations = await Donation.find({profileId: req.params.id}).sort({date: -1});
    if(!donations){
        return res.status(404).json({mssg: "No donations found."})
    }
    res.status(200).json(donations)
}

//Update a donation by ID
const updateDonation = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such donation.'})
    }

    const donation = await Donation.findById(id);

    if(!donation){
        return res.status(404).json({mssg: "No such donation found."})
    }

    const updatedDonation = await Donation.findByIdAndUpdate(id, req.body, {new: true});

    if(!updatedDonation){
        return res.status(404).json({mssg: "The update failed."})
    }
    res.status(200).json(updatedDonation)
}

//Delete a donation by ID
const deleteDonation = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such donation.'})
    }

    const donation = await Donation.findById(id);

    if(!donation){
        return res.status(404).json({mssg: "No such donation found."})
    }

    const deletedDonation = await Donation.findByIdAndDelete(id);

    if(!deletedDonation){
        return res.status(404).json({mssg: "The delete failed."})
    }
    res.status(200).json(deletedDonation)
}

//Pledges
//Post a pledge
const addPledge = async (req, res) => {
    const pledge = new Pledge({
        amount: req.body.amount,
        date: req.body.date,
        type: req.body.type,
        fund: req.body.fund,
        profileId: req.body.profileId
    })

    const pledgeToSave = await pledge.save();

    if(!pledgeToSave){
    return res.status(404).json({mssg: "The save failed."})}

    res.status(200).json(pledgeToSave)
}

//Get all pledges
const getAllPledges = async (req, res) => {
    const pledges = await Pledge.find({}).sort({date: -1});
    if(!pledges){
        return res.status(404).json({mssg: "No pledges were returned."})
    }
    res.status(200).json(pledges)
}

//Get pledge by ID
const getPledgeById = async (req, res) => {

    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such pledge.'})
    }
    const pledge = await Pledge.findById(id);

    if(!pledge){
        return res.status(404).json({mssg: "No such pledge found."})
    }
        
    res.status(200).json(pledge)
}

//Get pledges by profile
const getPledgesByProfile = async (req, res) => {
    const pledges = await Pledge.find({profileId: req.params.id}).sort({date: -1});
    if(!pledges){
        return res.status(404).json({mssg: "No pledges found."})
    }
    res.status(200).json(pledges)
}

//Update a pledge by ID
const updatePledge = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such pledge.'})
    }

    const pledge = await Pledge.findById(id);

    if(!pledge){
        return res.status(404).json({mssg: "No such pledge found."})
    }

    const updatedPledge = await Pledge.findByIdAndUpdate(id, req.body, {new: true});

    if(!updatedPledge){
        return res.status(404).json({mssg: "The update failed."})
    }
    res.status(200).json(updatedPledge)
}

//Delete a pledge by ID
const deletePledge = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such pledge.'})
    }

    const pledge = await Pledge.findById(id);

    if(!pledge){
        return res.status(404).json({mssg: "No such pledge found."})
    }

    const deletedPledge = await Pledge.findByIdAndDelete(id);

    if(!deletedPledge){
        return res.status(404).json({mssg: "The delete failed."})
    }
    res.status(200).json(deletedPledge)
}

//Vendors
//Post a vendor
const addVendor = async (req, res) => {
    const vendor = new Vendor({
        name: req.body.name,
        type: req.body.type,
        streetaddress1: req.body.streetaddress1,
        streetaddress2: req.body.streetaddress2,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        phone: req.body.phone,
        email: req.body.email
    })

    const vendorToSave = await vendor.save();

    if(!vendorToSave){
    return res.status(404).json({mssg: "The save failed."})}

    res.status(200).json(vendorToSave)
}

//Get all vendors
const getAllVendors = async (req, res) => {
    const vendors = await Vendor.find({}).sort({name: 1});
    if(!vendors){
        return res.status(404).json({mssg: "No vendors were returned."})
    }
    res.status(200).json(vendors)
}

//Get vendor by ID
const getVendorById = async (req, res) => {

    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such vendor.'})
    }
    const vendor = await Vendor.findById(id);

    if(!vendor){
        return res.status(404).json({mssg: "No such vendor found."})
    }
        
    res.status(200).json(vendor)
}

//Update a vendor by ID
const updateVendor = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such vendor.'})
    }

    const vendor = await Vendor.findById(id);

    if(!vendor){
        return res.status(404).json({mssg: "No such vendor found."})
    }

    const updatedVendor = await Vendor.findByIdAndUpdate(id, req.body, {new: true});

    if(!updatedVendor){
        return res.status(404).json({mssg: "The update failed."})
    }
    res.status(200).json(updatedVendor)
}

//Delete a vendor by ID
const deleteVendor = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such vendor.'})
    }

    const vendor = await Vendor.findById(id);

    if(!vendor){
        return res.status(404).json({mssg: "No such vendor found."})
    }

    const deletedVendor = await Vendor.findByIdAndDelete(id);

    if(!deletedVendor){
        return res.status(404).json({mssg: "The delete failed."})
    }
    res.status(200).json(deletedVendor)
}

//Expenses
//Post an expense
const addExpense = async (req, res) => {
    const expense = new Expense({
        amount: req.body.amount,
        date: req.body.date,
        type: req.body.type,
        vendorId: req.body.vendorId
    })

    const expenseToSave = await expense.save();

    if(!expenseToSave){
    return res.status(404).json({mssg: "The save failed."})}

    res.status(200).json(expenseToSave)
}

//Get all expenses
const getAllExpenses = async (req, res) => {
    const expenses = await Expense.find({}).sort({date: -1});
    if(!expenses){
        return res.status(404).json({mssg: "No expenses were returned."})
    }
    res.status(200).json(expenses)
}

//Get expense by ID
const getExpenseById = async (req, res) => {

    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such expense.'})
    }
    const expense = await Expense.findById(id);

    if(!expense){
        return res.status(404).json({mssg: "No such expense found."})
    }
        
    res.status(200).json(expense)
}

//Get expenses by vendor
const getExpensesByVendor = async (req, res) => {
    const expenses = await Expense.find({vendorId: req.params.id}).sort({date: -1});
    if(!expenses){
        return res.status(404).json({mssg: "No expenses found."})
    }
    res.status(200).json(expenses)
}

//Get expenses by fund
const getExpensesByFund = async (req, res) => {
    const expenses = await Expense.find({fund: req.params.fund}).sort({date: -1});
    if(!expenses){
        return res.status(404).json({mssg: "No expenses found."})
    }
    res.status(200).json(expenses)
}

//Update an expense by ID
const updateExpense = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such expense.'})
    }

    const expense = await Expense.findById(id);

    if(!expense){
        return res.status(404).json({mssg: "No such expense found."})
    }

    const updatedExpense = await Expense.findByIdAndUpdate(id, req.body, {new: true});

    if(!updatedExpense){
        return res.status(404).json({mssg: "The update failed."})
    }
    res.status(200).json(updatedExpense)
}

//Delete an expense by ID
const deleteExpense = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such expense.'})
    }

    const expense = await Expense.findById(id);

    if(!expense){
        return res.status(404).json({mssg: "No such expense found."})
    }

    const deletedExpense = await Expense.findByIdAndDelete(id);

    if(!deletedExpense){
        return res.status(404).json({mssg: "The delete failed."})
    }
    res.status(200).json(deletedExpense)
}

//Payroll
//Post a payroll
const addPayroll = async (req, res) => {
    const payroll = new Payroll({
        employeeId: req.body.employeeId,
        payPeriod: req.body.payPeriod,
        payDate: req.body.payDate,
        hours: req.body.hours,
        rate: req.body.rate,
        gross: req.body.gross,
        taxes: req.body.taxes,
        net: req.body.net
    })

    const payrollToSave = await payroll.save();

    if(!payrollToSave){
    return res.status(404).json({mssg: "The save failed."})}

    res.status(200).json(payrollToSave)
}

//Get all payrolls
const getAllPayrolls = async (req, res) => {
    const payrolls = await Payroll.find({}).sort({payDate: -1});
    if(!payrolls){
        return res.status(404).json({mssg: "No payrolls were returned."})
    }
    res.status(200).json(payrolls)
}

//Get payroll by ID
const getPayrollById = async (req, res) => {

    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such payroll.'})
    }
    const payroll = await Payroll.findById(id);

    if(!payroll){
        return res.status(404).json({mssg: "No such payroll found."})
    }
        
    res.status(200).json(payroll)
}

//Get payrolls by employee
const getPayrollsByEmployee = async (req, res) => {
    const payrolls = await Payroll.find({employeeId: req.params.id}).sort({payDate: -1});
    if(!payrolls){
        return res.status(404).json({mssg: "No payrolls found."})
    }
    res.status(200).json(payrolls)
}

//Update a payroll by ID
const updatePayroll = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such payroll.'})
    }

    const payroll = await Payroll.findById(id);

    if(!payroll){
        return res.status(404).json({mssg: "No such payroll found."})
    }

    const updatedPayroll = await Payroll.findByIdAndUpdate(id, req.body, {new: true});

    if(!updatedPayroll){
        return res.status(404).json({mssg: "The update failed."})
    }
    res.status(200).json(updatedPayroll)
}

//Delete a payroll by ID
const deletePayroll = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such payroll.'})
    }

    const payroll = await Payroll.findById(id);

    if(!payroll){
        return res.status(404).json({mssg: "No such payroll found."})
    }

    const deletedPayroll = await Payroll.findByIdAndDelete(id);

    if(!deletedPayroll){
        return res.status(404).json({mssg: "The delete failed."})
    }
    res.status(200).json(deletedPayroll)
}

//Post a fund
const addFund = async (req, res) => {
    try {
        const fund = new Fund(req.body);
        await fund.save();
        res.status(201).send(fund);
    } catch (error) {
        res.status(400).send(error);
    }
}

//Get all funds
const getAllFunds = async (req, res) => {
    try {
        const funds = await Fund.find({});
        res.status(200).send(funds);
    } catch (error) {
        res.status(400).send(error);
    }
}

//Get fund by ID
const getFundById = async (req, res) => {
    try {
        const fund = await Fund.findById(req.params.id);
        res.status(200).send(fund);
    } catch (error) {
        res.status(400).send(error);
    }
}

//Get a fund by name
const getFundsByName = async (req, res) => {
    try {
        const funds = await Fund.find({ name: req.params.name });
        res.status(200).send(funds);
    } catch (error) {
        res.status(400).send(error);
    }
}

//Update a fund by ID
const updateFund = async (req, res) => {
    try {
        await Fund.findByIdAndUpdate
            (req.params.id, req.body
                , { new: true, runValidators: true }
            );
        res.status(200).send('Fund updated');
    }
    catch (error) {
        res.status(400).send(error);
    }
}

//Delete a fund by ID
const deleteFund = async (req, res) => {
    try {
        await Fund.findByIdAndDelete(req.params.id);
        res.status(200).send('Fund deleted');
    } catch (error) {
        res.status(400).send(error);
    }
}

//Budgets
//Post a budget
const addBudget = async (req, res) => {
    try {
        const budget = new Budget(req.body);
        await budget.save();
        res.status(201).send(budget);
    } catch (error) {
        res.status(400).send(error);
    }
}

//Get all budgets
const getAllBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({});
        res.status(200).send(budgets);
    } catch (error) {
        res.status(400).send(error);
    }
}

//Get budget by ID
const getBudgetById = async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id);
        res.status(200).send(budget);
    } catch (error) {
        res.status(400).send(error);
    }
}

//Get budgets by fund
const getBudgetsByFund = async (req, res) => {
    try {
        const budgets = await Budget.find({ fundId: req.params.id });
        res.status(200).send(budgets);
    } catch (error) {
        res.status(400).send(error);
    }
}

//Get budget by year
const getBudgetsByYear = async (req, res) => {
    try {
        const budgets = await Budget.find({ budgetYear: req.params.year });
        res.status(200).send(budgets);
    } catch (error) {
        res.status(400).send(error);
    }
}

//Update a budget by ID
const updateBudget = async (req, res) => {
    try {
        await Budget.findByIdAndUpdate
            (req.params.id, req.body
                , { new: true, runValidators: true }
            );
        res.status(200).send('Budget updated');
    }
    catch (error) {
        res.status(400).send(error);
    }
}   

//Delete a budget by ID
const deleteBudget = async (req, res) => {
    try {
        await Budget.findByIdAndDelete(req.params.id);
        res.status(200).send('Budget deleted');
    } catch (error) {
        res.status(400).send(error);
    }
}

//Assets
//Post an asset
const addAsset = async (req, res) => {
    try {
        const asset = new Asset(req.body);
        await asset.save();
        res.status(201).send(asset);
    } catch (error) {
        res.status(400).send(error);
    }
}

//Get all assets
const getAllAssets = async (req, res) => {
    try {
        const assets = await Asset.find({});
        res.status(200).send(assets);
    } catch (error) {
        res.status(400).send(error);
    }
}

//Get asset by ID
const getAssetById = async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id);
        res.status(200).send(asset);
    } catch (error) {
        res.status(400).send(error);
    }
}

//Get assets by type
const getAssetsByType = async (req, res) => {
    try {
        const assets = await Asset.find({ assetType: req.params.type });
        res.status(200).send(assets);
    } catch (error) {
        res.status(400).send(error);
    }
}

//Get assets by category
const getAssetsByCategory = async (req, res) => {
    try {
        const assets = await Asset.find({ assetCategory: req.params.category });
        res.status(200).send(assets);
    } catch (error) {
        res.status(400).send(error);
    }
}

//Get assets by location
const getAssetsByLocation = async (req, res) => {
    try {
        const assets = await Asset.find({ assetLocation: req.params.location });
        res.status(200).send(assets);
    } catch (error) {
        res.status(400).send(error);
    }
}

//Update an asset by ID
const updateAsset = async (req, res) => {
    try {
        await Asset.findByIdAndUpdate
            (req.params.id, req.body
                , { new: true, runValidators: true }
            );
        res.status(200).send('Asset updated');
    }
    catch (error) {
        res.status(400).send(error);
    }
}

//Delete an asset by ID
const deleteAsset = async (req, res) => {
    try {
        await Asset.findByIdAndDelete(req.params.id);
        res.status(200).send('Asset deleted');
    } catch (error) {
        res.status(400).send(error);
    }
}







module.exports = {
    addDonation,
    getAllDonations,
    getDonationById,
    getDonationsByProfile,
    updateDonation,
    deleteDonation,
    addPledge,
    getAllPledges,
    getPledgeById,
    getPledgesByProfile,
    updatePledge,
    deletePledge,
    addVendor,
    getAllVendors,
    getVendorById,
    updateVendor,
    deleteVendor,
    addExpense,
    getAllExpenses,
    getExpenseById,
    getExpensesByVendor,
    getExpensesByFund,
    updateExpense,
    deleteExpense,
    addPayroll,
    getAllPayrolls,
    getPayrollById,
    getPayrollsByEmployee,
    updatePayroll,
    deletePayroll,
    addFund,
    getAllFunds,
    getFundById,
    getFundsByName,
    updateFund,
    deleteFund,
    addBudget,
    getAllBudgets,
    getBudgetById,
    getBudgetsByFund,
    getBudgetsByYear,
    updateBudget,
    deleteBudget,
    addAsset,
    getAllAssets,
    getAssetById,
    getAssetsByType,
    getAssetsByCategory,
    getAssetsByLocation,
    updateAsset,
    deleteAsset
}