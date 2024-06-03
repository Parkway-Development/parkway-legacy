const mongoose = require('mongoose');
const Application = require('../models/applicationModel');
const removeSensitiveData = require('../helpers/objectSanitizer');
const appError = require('../applicationErrors');
const ValidationHelper = require('../helpers/validationHelper');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { generateApplicationSecret } = require('../helpers/applicationSecretGen');
const { generateApiKey } = require('../helpers/apiKeyGen');

const addApplication = async (req, res, next) => {
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

        const { name, description, ownerProfileId } = req.body;

        if(!name){ throw new appError.MissingRequiredParameters('addApplication','Application name is missing')}
        if(!ownerProfileId){ throw new appError.MissingRequiredParameters('addApplication','Application owner profile Id is missing')}
        if(!ValidationHelper.validateProfileId(ownerProfileId)){ throw new appError.InvalidProfileId('addApplication', 'The owner profile Id is invalid.')};

        const existingApplication = await Application.findOne({name: name});
        if(existingApplication){ throw new appError.DuplicateApplication('addApplication', `An application with thte name ${name} already exists.`)}

        //generate secret
        const secret = generateApplicationSecret();

        //generate key
        const rawKey = generateApiKey();
        const hashedKey = await bcrypt.hash(rawKey, saltRounds);
        const keyExpiration = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

        const application = new Application({
            name: name,
            description: description,
            isExternal: isExternal,
            currentSecret: secret,
            currentKey: hashedKey,
            keyExpiration: keyExpiration,
            ownerProfileId: ownerProfileId,
            queryRateLimit: queryRateLimit,
            queryRateInterval: queryRateInterval
        });

        await application.save();

       
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
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

//Get all applications
const getAllApplications = async (req, res, next) => {
    try {
        const applications = await Application.find({});
    
        if(applications.length === 0){ return res.status(204).json({error: 'No applications were found'})}
    
        return res.status(200).json(removeSensitiveData(applications));
    
    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }

}

const getApplicationById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if(!id) { throw new appError.MissingId('getApplicationById')}
        if (!mongoose.Types.ObjectId.isValid(id)) { throw new appError.InvalidId('getApplicationById')}

        const application = await Application.findById(_id = id);

        if(!application){ return res.status(204).json({error: 'No application was found with that Id.'})}
            
        res.status(200).json(removeSensitiveData(application))
    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const getApplicationByName = async (req, res, next) => {
    try {
        const name = req.params.name;
        if(!name){ throw new appError.MissingRequiredParameters('getApplicationByName')}

        const application = await Application.findOne({name});
        if(!application){ return res.status(204).json({error: 'No application was found with that name.'})}

        res.status(200).json(removeSensitiveData(application))
    
    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const getApplicationsByType = async (req, res, next) => {

    try {
        const type = req.params.type;
        let isExternal = true;
        if(type && type.toLowerCase() === "internal") { isExternal = false }
    
        const applications = await Application.find({isExternal: isExternal});
        if(applications.length === 0){ return res.status(204).json({error: 'No applications were found'})};

        return res.status(200).json(removeSensitiveData(applications))
    
    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const deleteApplication = async (req, res) => {
    try {
        const {id} = req.params.id;
        if(!id){ throw new appError.MissingId('deleteApplication') }
        if(!mongoose.Types.ObjectId.isValid(id)){ throw new appError.InvalidId('deleteApplication')}

        const application = await Application.findByIdAndDelete(id);
    
        if(!application){ return res.status(204).json({error: 'No application was found with that Id.'})};

        return res.status(200).json({ message: "The application registration was deleted" }, { application: removeSensitiveData(application) })
    
    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

//Regenerate an api key
const replaceKey = async (req, res) => {
    try{
        const { id } = req.params;
        if (!id){ throw new appError.MissingId('replaceKey') }

        let application = await Application.findById(id);
        if(!application){ return res.status(204).json({error: 'No application was found with that Id.'})}

        const oldKey = application.currentKey;
        application.previousKeys.push(oldKey);
        const newKey = generateApiKey();
        const hashedKey = await bcrypt.hash(newKey, saltRounds);
        application.currentKey = hashedKey;

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