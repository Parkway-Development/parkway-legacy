const mongoose = require('mongoose');
const Application = require('../models/applicationModel');
const removeSensitiveData = require('../helpers/objectSanitizer');

const bcrypt = require('bcrypt');
const saltRounds = 10;

//Does not require an app secret or api key
//Add an application
const addApplication = async (req, res) => {

    try {
        console.log(req.body)

        let isExternal = req.body.isExternal !== 'false';
        let queryRateLimit = req.body.queryRateLimit || 1000
        let queryRateInterval = req.body.queryRateInterval || 'day';
        
        // if (req.body.isExternal === false) { isExternal = req.body.isExternal }
        if(req.body.queryRateLimit) { queryRateLimit = req.body.queryRateLimit }
        if (req.body.queryRateInterval) { queryRateInterval = req.body.queryRateInterval }

        if(!isExternal) { 
            queryRateLimit = 0,
            queryRateInterval = 'unlimited'
        }

        const { name, description, owner } = req.body;

        console.log("Name:", name, " | Description:", description, " | Owner:", owner, " | isExternal:", isExternal, " | queryRateLimit", queryRateLimit, " | queryRateInterval", queryRateInterval)

        if(!name || !owner){
            return res.status(400).json({message: "Application name and owner are required.  If not specified, the application will be set to external by default."})
        }

        const existingApplication = await Application.findOne({name: name});
        if(existingApplication){
            return res.status(409).json({message: "An application with that name already exists.  Names must be unique.  Please try again."})
        }

        //generate secret
        const secret = generateApplicationSecret();

        //generate key
        const rawKey = await generateApiKey();
        const hashedKey = await bcrypt.hash(rawKey, saltRounds);
        const keyExpiration = new Date(new Date().setFullYear(new Date().getFullYear() + 1));



        const application = new Application({name: name, 
            description: description, 
            isExternal: isExternal, 
            currentSecret: secret,  
            currentKey: hashedKey, 
            keyExpiration: keyExpiration,
            owner: owner,
            queryRateLimit: queryRateLimit,
            queryRateInterval: queryRateInterval});

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
        res.status(400).json({
            error: error.message
        });
    }
}

const { generateApplicationSecret } = require('../helpers/applicationSecretGen');
const { generateApiKey } = require('../helpers/apiKeyGen');

//TODO: Require the isspecops claim to access these routes

//Get all applications
const getAllApplications = async (req, res) => {
    const applications = await Application.find({});
    
    if(!applications){
        return res.status(404).json({message: "No applications were returned."})
    }

    res.status(200).json(removeSensitiveData(applications));

}

//Get Application by ID
const getApplicationById = async (req, res) => {

    console.log(req.params)
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'We cannot retrieve an applications using the Id provided.  The ID is not valid.'})
    }
    const application = await Application.findById(id);

    if(!application){
        return res.status(404).json({message: "No application was found with that Id."})
    }
        
    res.status(200).json(removeSensitiveData(application))
}

//Get application by name
const getApplicationByName = async (req, res) => {

    console.log(req.params)
    const name = req.params.name;
    console.log(name)
    const application = await Application.findOne({name});

    if(!application){
        return res.status(404).json({message: "We could not find an application with that name."})
    }
    res.status(200).json(removeSensitiveData(application))
}

//Get Applications By Type
const getApplicationsByType = async (req, res) => {

    console.log(req.params)
    const type = req.params.type;
    let isExternal = true;
    if(type && type.toLowerCase() === "internal") { isExternal = false }

    const applications = await Application.find({isExternal: isExternal});
    if(applications.length === 0){
        return res.status(404).json({message: "No applications were found matching that criteria."})
    }
    res.status(200).json(removeSensitiveData(applications))
}

//Delete an application
const deleteApplication = async (req, res) => {
    const id = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'We cannot delete the application using the Id provided.  The Id is invalid.'})
    }

    const application = await Application.findByIdAndDelete(id);

    if(!application){
        return res.status(404).json({message: "No application was deleted.  We could not find an application with that Id."})
    }
    res.status(200).json({ message: "The application registration was deleted" }, { application: removeSensitiveData(application) })
}

//Regenerate an api key
const replaceKey = async (req, res) => {
    const { id } = req.params;
    try{
        console.log(req.params)
        console.log(id)
        //Get the application
        const application = await Application.findById(id);
        if(!application){
            return res.status(404).json({message: "We could not find an application with the provided Id."});
        }

        //Move the current key to previous keys
        application.previousKeys.push(application.currentKey);

        //Generate a new key and get its Id to add to the application
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