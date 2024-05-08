const mongoose = require('mongoose');
const ApplicationClaim = require('../models/applicationClaimModel');

const addApplicationClaim = async (req, res) => {
    try {
        const applicationClaim = new ApplicationClaim(req.body);

        const query = { name: applicationClaim.name.toLowerCase() };
        const existingApplicationClaim = await ApplicationClaim.findOne(query);        
        if (existingApplicationClaim) { throw new Error("This ApplicationClaim already exists."); }

        const newApplicationClaim = await applicationClaim.save();        
        if (!newApplicationClaim) { throw new Error("The save failed."); }

        return res.status(201).json(newApplicationClaim);
    } catch (error) {
        return res.status(500).json(error);
    }
};

const getAllApplicationClaims = async (req, res) => {
    try {
        const applicationClaims = await ApplicationClaim.find({})
        if (applicationClaims.length === 0) { throw new Error("No ApplicationClaims found.");}

        return res.status(200).json(applicationClaims)
    } catch (error) {
        return res.status(500).json(error)
    }
}

const getApplicationClaimById = async (req, res) => {
    try {
        const {id}  = req.params.id
        if (!mongoose.Types.ObjectId.isValid(id)) { throw new Error("Invalid ID."); }

        const applicationClaim = await ApplicationClaim.findById(_id = id)
        if (!applicationClaim) { throw new Error("No such ApplicationClaim found."); }

        return res.status(200).json(applicationClaim)
    }
    catch (error) {
        return res.status(500).json(error)
    }
}

const getApplicationClaimByName = async (req, res) => {
//All ApplicationClaims are lowercase with no spaces
    try {
        const name = req.params.name.toLowerCase();
        if (!name) throw new Error("Please provide a name.")

        const applicationClaim = await ApplicationClaim.findOne({name: name})
        if (!applicationClaim) { throw new Error("No such ApplicationClaim found."); }

        return res.status(200).json(applicationClaim)
    }
    catch (error) {
        return res.status(500).json(error)
    }
}

const updateApplicationClaim = async (req, res) => {
    try {
        const {id} = req.params.id;
        if(!id) throw new Error("Please provide an ID.");
        if (!mongoose.Types.ObjectId.isValid(id)) { throw new Error("Invalid ID."); }

        const { name, description, values } = req.body;
        const updateData = {};

        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (!name && !description) { throw new Error("Please provide name and/or description to update."); }
        if (values && !name && !description) { throw new Error("You cannot update the values of an ApplicationClaim using this endpoint.  Use the /values endpoint instead."); }

        const updatedApplicationClaim = await ApplicationClaim.findByIdAndUpdate(
            _id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedApplicationClaim) { throw new Error("No such ApplicationClaim found."); }
        return res.status(200).json(updatedApplicationClaim);
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
};

//TODO: Add a check to see if an existng ApplicationClaim values has been updated to a new value and retrofit the change to all profiles that have the ApplicationClaim
const updateApplicationClaimValues = async (req, res) => {
    try {
        const {id} = req.params.id; 
        if (!id) throw new Error("Please provide an ID.");
        if (!mongoose.Types.ObjectId.isValid(id)) { throw new Error("Invalid ID."); }

        const values = req.body.values;
        if (!values) { throw new Error("Please provide values to update."); }

        const updatedApplicationClaim = await ApplicationClaim.findByIdAndUpdate( _id = id, { $set: { values: values } },{ new: true });

        if (!updatedApplicationClaim) { throw new Error("No such ApplicationClaim found."); }

        return res.status(200).json(updatedApplicationClaim);
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
};

//TODO: Add a check to see if the ApplicationClaim is associated with any profiles before deleting
const deleteApplicationClaim = async (req, res) => {
    try {
        const {id} = req.params.id
        if (!id) throw new Error("Please provide an ID.");
        if (!mongoose.Types.ObjectId.isValid(id)) { throw new Error("Invalid ID."); }

        const applicationClaim = await ApplicationClaim.findByIdAndDelete(_id)
        if (!applicationClaim) { throw new Error("No such ApplicationClaim found."); }

        return res.status(200).json(applicationClaim)
    }catch (error) {
        return res.status(500).json(error)
    }   
}


module.exports = {
    addApplicationClaim,
    getAllApplicationClaims,
    getApplicationClaimById,
    getApplicationClaimByName,
    updateApplicationClaim,
    deleteApplicationClaim,
    updateApplicationClaimValues
}