const mongoose = require('mongoose');
const ApplicationClaim = require('../models/applicationClaimModel');

//Add a claim
const addApplicationClaim = async (req, res) => {
    const applicationClaim = new ApplicationClaim(req.body);

    try {
        const query = { name: applicationClaim.name.toLowerCase() };
        const existingApplicationClaim = await ApplicationClaim.findOne(query);
        
        if (existingApplicationClaim) {
            return res.status(400).json({message: "This ApplicationClaim already exists."});
        }

        const newApplicationClaim = await applicationClaim.save();
        
        if (!newApplicationClaim) {
            return res.status(400).json({ message: "The save failed." });
        }
        return res.status(201).json(newApplicationClaim);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

//Get all ApplicationClaims
const getAllApplicationClaims = async (req, res) => {
    try {
        const applicationClaims = await ApplicationClaim.find({})
        return res.status(200).json(applicationClaims)
    } catch (error) {
        return res.status(500).json(error)
    }
}

//Get ApplicationClaim by id
const getApplicationClaimById = async (req, res) => {
    const _id = req.params.id

    try {
        const applicationClaim = await ApplicationClaim.findById(_id)
        if (!applicationClaim) {
            return res.status(404).json({message: "No such ApplicationClaim found."})
        }
        return res.status(200).json(applicationClaim)
    }
    catch (error) {
        return res.status(500).json({message: error.message})
    }
}

//Get ApplicationClaim by name.  All ApplicationClaims are lowercase with no spaces
const getApplicationClaimByName = async (req, res) => {
    const name = req.params.name.toLowerCase();
    console.log(name)

    try {
        const applicationClaim = await ApplicationClaim.findOne({name: name})
        if (!applicationClaim) {
            return res.status(404).json({message: "No such ApplicationClaim found."})
        }
        return res.status(200).json(applicationClaim)
    }
    catch (error) {
        return res.status(500).json({message: error.message})
    }
}

//Update a ApplicationClaim
const updateApplicationClaim = async (req, res) => {
    const _id = req.params.id; 

    const { name, description, values } = req.body;
    const updateData = {};
    const valuesError = "You cannot update the values of an ApplicationClaim using this endpoint.  Use the /values endpoint instead."
    
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    
    // If only values were provided, return an error
    if (values && !name && !description) {
        return res.status(400).json({ message: valuesError });
    }


    // Proceed with the update only if at least one of the fields is provided
    if (!name && !description) {
        return res.status(400).json({ message: "Please provide name or description to update." });
    }

    try {
        const updatedApplicationClaim = await ApplicationClaim.findByIdAndUpdate(
            _id,
            { $set: updateData },
            { new: true, runValidators: true } // Return the updated document and run schema validators
        );

        if (!updatedApplicationClaim) {
            // No document was found with the provided ID
            return res.status(404).json({ message: "No such ApplicationClaim found." });
        }

        // Successfully updated and found the document
        if(values) return res.status(200).json({ updatedApplicationClaim: updatedApplicationClaim, message: valuesError });
        return res.status(200).json(updatedApplicationClaim);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

//TODO: Add a check to see if an existng ApplicationClaim values has been updated to a new value and retrofit the change to all profiles that have the ApplicationClaim
//Update an ApplicationClaim.Values by ID
const updateApplicationClaimValues = async (req, res) => {
    const _id = req.params.id; 

    try {
        const updatedApplicationClaim = await ApplicationClaim.findByIdAndUpdate( _id, { $set: { values: req.body.values } },{ new: true });

        if (!updatedApplicationClaim) {
            return res.status(404).json({ message: "No such ApplicationClaim found." });
        }

        // Successfully updated and found the document
        return res.status(200).json(updatedApplicationClaim);
    } catch (error) {
        console.error(error); // Log the error to the console for debugging
        return res.status(500).json({ message: error.message });
    }
};

//Delete a ApplicationClaim
//TODO: Add a check to see if the ApplicationClaim is associated with any profiles before deleting
const deleteApplicationClaim = async (req, res) => {
    const _id = req.params.id

    try {
        const applicationClaim = await ApplicationClaim.findByIdAndDelete(_id)
        if (!applicationClaim) {
            return res.status(404).json({message: "No such ApplicationClaim found."})
        }
        return res.status(200).json(applicationClaim)
    }catch (error) {
        return res.status(500).json({message: error.message})
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