const mongoose = require('mongoose');
const Application = require('../../models/developer/applicationModel');
const Key = require('../../models/developer/keyModel');
const removeSensitiveData = require('../../helpers/objectSanitizer');

const bcrypt = require('bcrypt');
const saltRounds = 10;
const { generateApplicationSecret } = require('../../helpers/applicationSecretGen');
const { generateApiKey } = require('../../helpers/apiKeyGen');
const { response } = require('express');

//Add an application
const addApplication = async (req, res) => {
    // Process:
    // 1. Check if the application name already exists - done
    // 2. Generate a secret for the application - done
    // 3. Hash the secret - done
    // 4. Save the application to the database
    // 5. Generate a key for the application
    // 6. Hash the key
    // 7. Save the key to the database
    try {
        const { name, description, isExternal, userId } = req.body;
        console.log(name)
        console.log(description)
        console.log(isExternal)
        console.log(userId)

        if(!name || !userId){
            return res.status(400).json({message: "Application name and user ID are required.  If not specified, the application will be set to external by default."})
        }

        const existingApplication = await Application.findOne({name: name});
        if(existingApplication){
            return res.status(409).json({message: "An application with that name already exists.  Names must be unique.  Please try again."})
        }

        const secret = await generateApplicationSecret();
        const hashedSecret = await bcrypt.hash(secret, saltRounds);
        const application = new Application({name: name, description: description, isExternal: isExternal, applicationSecret: hashedSecret, user: userId});


        await application.save();
        res.status(201).json(application);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

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

//TODO: Get Application by Secret


//Update an application
const updateApplication = async (req, res) => {

    try{
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'We cannot update the application using the Id provided.  The Id is invavlid.' });
        }

        let application = await Application.findOneAndUpdate({ _id: id },
            { ...req.body },
            { new: true }
        );
        
        if(!application){
            return res.status(404).json({message: "No application was updated.  We could not find an application with that Id."})
        }
        res.status(200).json(removeSensitiveData(application))
    } catch (error) {
        res.status(500).json({error: error.message});
    }
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

module.exports = {
    getAllApplications,
    getApplicationById,
    getApplicationByName,
    getApplicationsByType,
    addApplication,
    updateApplication,
    deleteApplication
}