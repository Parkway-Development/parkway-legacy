//setup Mongoose
const mongoose = require('mongoose');
//import the necessary models
const Vendor = require('../../models/accounting/vendorModel');

//Post a vendor
const addVendor = async (req, res) => {

    const vendor = new Vendor(req.body)
    const vendorToSave = await vendor.save();

    if(!vendorToSave){
    return res.status(404).json({message: "The save failed."})}

    res.status(200).json(vendorToSave)
}

//Get all vendors
const getAllVendors = async (req, res) => {
    const vendors = await Vendor.find({}).sort({name: 1});
    if(!vendors){
        return res.status(404).json({message: "No vendors were returned."})
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
        return res.status(404).json({message: "No such vendor found."})
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
        return res.status(404).json({message: "No such vendor found."})
    }

    const updatedVendor = await Vendor.findByIdAndUpdate(id, req.body, {new: true});

    if(!updatedVendor){
        return res.status(404).json({message: "The update failed."})
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
        return res.status(404).json({message: "No such vendor found."})
    }

    const deletedVendor = await Vendor.findByIdAndDelete(id);

    if(!deletedVendor){
        return res.status(404).json({message: "The delete failed."})
    }
    res.status(200).json(deletedVendor)
}

module.exports = {
    addVendor,
    getAllVendors,
    getVendorById,
    updateVendor,
    deleteVendor
}