//setup Mongoose
const mongoose = require('mongoose');
//import the necessary models
const Payroll = require('../models/payrollModel');


//Post a payroll
const addPayroll = async (req, res) => {
    const payroll = new Payroll(req.body)
    const payrollToSave = await payroll.save();

    if(!payrollToSave){
    return res.status(404).json({message: "The save failed."})}

    res.status(200).json(payrollToSave)
}

//Get all payrolls
const getAllPayrolls = async (req, res) => {
    const payrolls = await Payroll.find({}).sort({payDate: -1});
    if(!payrolls){
        return res.status(404).json({message: "No payrolls were returned."})
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
        return res.status(404).json({message: "No such payroll found."})
    }
        
    res.status(200).json(payroll)
}

//Get payrolls by employee
const getPayrollsByEmployee = async (req, res) => {
    const payrolls = await Payroll.find({employeeId: req.params.id}).sort({payDate: -1});
    if(!payrolls){
        return res.status(404).json({message: "No payrolls found."})
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
        return res.status(404).json({message: "No such payroll found."})
    }

    const updatedPayroll = await Payroll.findByIdAndUpdate(id, req.body, {new: true});

    if(!updatedPayroll){
        return res.status(404).json({message: "The update failed."})
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
        return res.status(404).json({message: "No such payroll found."})
    }

    const deletedPayroll = await Payroll.findByIdAndDelete(id);

    if(!deletedPayroll){
        return res.status(404).json({message: "The delete failed."})
    }
    res.status(200).json(deletedPayroll)
}

module.exports = {
    addPayroll, 
    getAllPayrolls, 
    getPayrollById, 
    getPayrollsByEmployee, 
    updatePayroll, 
    deletePayroll
}
