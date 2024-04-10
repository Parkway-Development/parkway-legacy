const mongoose = require('mongoose');
const Application = require('../../models/apikey/applicationModel');

const bcrypt = require('bcrypt');
const saltRounds = 10;
const { generateApplicationSecret } = require('../../helpers/applicationSecretGen');

//Get all applications
const getAll = async (req, res) => {
    const applications = await Application.find({});
    if(!applications){
        return res.status(404).json({message: "No applications were returned."})
    }
    res.status(200).json(applications)
}

//Get Application by ID
const getById = async (req, res) => {

    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such application.'})
    }
    const application = await Application.findById(id);

    if(!application){
        return res.status(404).json({message: "No such application found."})
    }
        
    res.status(200).json(application)
}

//Get application by name
const getByName = async (req, res) => {

    const { name } = req.params;

    const application = await Application.findOne({name});

    if(!application){
        return res.status(404).json({message: "No such application found."})
    }
    res.status(200).json(application)
}

//Get External Applications
const getExternalApplications = async (req, res) => {
    const applications = await Application.find({isExternal: true});
    if(!applications){
        return res.status(404).json({message: "No applications were returned."})
    }
    res.status(200).json(applications)
}

//Get Internal Applications
const getInternalApplications = async (req, res) => {
    const applications = await Application.find({isExternal: false});
    if(!applications){
        return res.status(404).json({message: "No applications were returned."})
    }
    res.status(200).json(applications)
}

//Add an application
const addApplication = async (req, res) => {
    try {
        const { name, description, isExternal } = req.body;
        const existingApplication = await Application.findOne({name: name});
        if(existingApplication){
            return res.status(409).json({message: "An application with that name already exists.  Names must be unique.  Please try again."})
        }

        const secret = await generateApplicationSecret();
        const hashedSecret = await bcrypt.hash(secret, saltRounds);
        const application = new Application({name: name, description: description, isExternal: isExternal, applicationSecret: hashedSecret});


        await application.save();
        res.status(201).json(application);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

//Update an application
const updateApplication = async (req, res) => {

    try{
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'No such profile.' });
        }

        let application = await Application.findOneAndUpdate({ _id: id },
            { ...req.body },
            { new: true }
        );
        
        if(!application){
            return res.status(404).json({message: "No such application found."})
        }
        res.status(200).json(application)
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

//Delete an application
const deleteApplication = async (req, res) => {
    const id = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such application.'})
    }

    const application = await Application.findByIdAndDelete(id);

    if(!application){
        return res.status(404).json({message: "No such application found."})
    }
    res.status(200).json({ message: "The application registration was deleted" }, { application: application })
}

module.exports = {
    getAll,
    getById,
    getByName,
    getExternalApplications,
    getInternalApplications,
    addApplication,
    updateApplication,
    deleteApplication
}