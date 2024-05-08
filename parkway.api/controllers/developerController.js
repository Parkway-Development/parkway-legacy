const mongoose = require('mongoose');
const Application = require('../models/applicationModel');
const removeSensitiveData = require('../helpers/objectSanitizer');

const bcrypt = require('bcrypt');
const saltRounds = 10;
const { generateApplicationSecret } = require('../helpers/applicationSecretGen');
const { generateApiKey } = require('../helpers/apiKeyGen');

const addApplication = async (req, res) => {
    try {
        let isExternal = req.body.isExternal !== 'false';
        let queryRateLimit = req.body.queryRateLimit || 1000
        let queryRateInterval = req.body.queryRateInterval || 'day';
        
        if(req.body.queryRateLimit) { queryRateLimit = req.body.queryRateLimit }
        if (req.body.queryRateInterval) { queryRateInterval = req.body.queryRateInterval }

        if(!isExternal) { 
            queryRateLimit = 0,
            queryRateInterval = 'unlimited'
        }

        const { name, description, owner } = req.body;

        if(!name || !owner){ throw new Error("Application name and owner are required.  If not specified, the application will be set to external by default.")}

        const existingApplication = await Application.findOne({name: name});
        if(existingApplication){ throw new Error("An application with that name already exists.  Names must be unique.  Please try again.")}

        //generate secret
        const secret = generateApplicationSecret();

        //generate key
        const rawKey = await generateApiKey();
        const hashedKey = await bcrypt.hash(rawKey, saltRounds);
        const keyExpiration = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

        const application = await Application({name: name, 
            description: description, 
            isExternal: isExternal, 
            currentSecret: secret,  
            currentKey: hashedKey, 
            keyExpiration: keyExpiration,
            owner: owner,
            queryRateLimit: queryRateLimit,
            queryRateInterval: queryRateInterval}.save());

        if(!application){ throw new Error("The application could not be saved.")}
        
        res.status(201).json({ 
            message: "Please record your application secret and your application's Api Key.  The Api Key is stored encrypted and is not retrievable after this.", 
            applicationName: application.name,
            applicationSecret: secret,
            applicationKey: rawKey,
            keyExpiration: application.keyExpiration,
            queryRateLimit: application.queryRateLimit,
            queryRateInterval: application.queryRateInterval
        });
    } catch (error) {
        res.status(400).json(error);
    }
}

//Get all applications
const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find({});
    
        if(applications.length === 0){ throw new Error("No applications were found.")}
    
        return res.status(200).json(removeSensitiveData(applications));
    
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }

}

const getApplicationById = async (req, res) => {
    try {
        const { id } = req.params;
        if(!id) { throw new Error("Please provide an application Id.")}
        if (!mongoose.Types.ObjectId.isValid(id)) { throw new Error("Invalid ID.")}

        const application = await Application.findById(_id = id);

        if(!application){ throw new Error("No application was found with that Id.")}
            
        res.status(200).json(removeSensitiveData(application))
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

const getApplicationByName = async (req, res) => {
    try {
        const name = req.params.name;
        if(!name){ throw new Error("Please provide an application name.")}

        const application = await Application.findOne({name});
        if(!application){ throw new Error("No application was found with that name.")}

        res.status(200).json(removeSensitiveData(application))
    
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

const getApplicationsByType = async (req, res) => {

    try {
        const type = req.params.type;
        let isExternal = true;
        if(type && type.toLowerCase() === "internal") { isExternal = false }
    
        const applications = await Application.find({isExternal: isExternal});
        if(applications.length === 0){ throw new Error("No applications were found matching that criteria.")}

        return res.status(200).json(removeSensitiveData(applications))
    
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

const deleteApplication = async (req, res) => {
    try {
        const {id} = req.params.id;
        if(!id){ return res.status(404).json({error: 'Please provide an Id for the application to delete.'})}
        if(!mongoose.Types.ObjectId.isValid(id)){ throw new Error("Invalid Id.")}

        const application = await Application.findByIdAndDelete(id);
    
        if(!application){ throw new Error("No application was found with that Id.")}

        return res.status(200).json({ message: "The application registration was deleted" }, { application: removeSensitiveData(application) })
    
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

//Regenerate an api key
const replaceKey = async (req, res) => {
    try{
        const { id } = req.params;
        if (!id){throw new Error("Please provide an application Id.")}

        const application = await Application.findById(id);
        if(!application){ throw new Error("No application was found with that Id.")}

        //keep the old key just in case something breaks
        const oldKey = application.currentKey;
        //Generate a new key and get its Id to add to the application
        application.previousKeys.push(oldKey);
        const newKey = generateApiKey();
        const hashedKey = await bcrypt.hash(newKey, saltRounds);
        application.currentKey = hashedKey;

        //Set the expiration date to now
        application.keyExpiration = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

        await application.save({new: true});
        res.status(200).json({message: "The application key was successfully replaced.", newKey: newKey, keyExpiration: application.keyExpiration})

    }catch(error){
        return res.status(500).json(error);
    }
}

//TODO: Transfer an application to a new owner

module.exports = {
    getAllApplications,
    getApplicationById,
    getApplicationByName,
    getApplicationsByType,
    addApplication,
    deleteApplication,
    replaceKey
}