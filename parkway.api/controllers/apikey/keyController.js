const mongoose = require('mongoose');
const Key = require('../../models/apikey/keyModel');
const Application = require('../../models/apikey/applicationModel');

const bcrypt = require('bcrypt');
const saltRounds = 10;
const { generateApiKey } = require('../../helpers/apiKeyGen');

//Get all api keys
const getAllApiKeys = async (req, res) => {
    try{
        const keys = await Key.find({});
        if(!keys){
            return res.status(404).json({message: "No api keys found."});
        }
        return res.status(200).json(keys);
    }catch(error){
        return res.status(500).json(error);
    }
}

//Get api key by id
const getKeyById = async (req, res) => {
    const { id } = req.params;
    try{
        const key = await ApiKey.findById(id);
        if(!key){
            return res.status(404).json({message: "No such api key found."});
        }
        return res.status(200).json(apiKey);
    }
    catch(error){
        return res.status(500).json(error);
    }
}

//TODO:Get api key by application name

//TODO:Get api key by application secret

//Add api key
const addApiKey = async (req, res) => {
    try{
        const rawKey = generateApiKey();
        const hashedKey = await bcrypt.hash(rawKey, saltRounds);
        const key = await Key.create({
            key: hashedKey,
            application: req.body.application,
        });
        return response.status(201).json({ key: key }, { message: "API Key generated successfully.  Please record this key.  It is encrypted in the database and is not viewable or retrievable in an unencrypted state after this." });
    }catch(error){
        return res.status(500).json(error)
    }
}



const deleteApiKey = async (req, res) => {
    const { id } = req.params;
    try{
        const apiKey = await ApiKey.findByIdAndDelete(id);
        if(!apiKey){
            return res.status(404).json({message: "No such api key found."});
        }
        return res.status(200).json(apiKey);
    }
    catch(error){
        return res.status(500).json(error);
    }
}

const renewApiKey = async (req, res) => {
    const { id } = req.params;
    try{
        const apiKey = await ApiKey.findById(id);
        if(!apiKey){
            return res.status(404).json({message: "No such api key found."});
        }
        let renewalDate = new Date();
        renewalDate.setFullYear(renewalDate.getFullYear() + 1);
        apiKey.expiresAt = renewalDate;
        await apiKey.save();
        return res.status(200).json(apiKey);
    }
    catch(error){
        return res.status(500).json(error);
    }
}

module.exports = {
    addApiKey,
    getAllApiKeys,
    getApiKeyById,
    deleteApiKey,
    renewApiKey
}