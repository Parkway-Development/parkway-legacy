const mongoose = require('mongoose');
const Client = require('../models/apiKeyModel');
const ApiKey = require('../models/apiKeyModel');
const { generateApiKey } = require('../utils/apiKeyGen');

const addApiKey = async (req, res) => {
    try{
        const key = generateApiKey();
        const apiKey = await ApiKey.create({
            key: key,
            user: req.user._id
        });
        return response.status(201).json({ apiKey: apiKey });
    }catch(error){
        return res.status(500).json(error)
    }
}

const getAllApiKeys = async (req, res) => {
    try{
        const apiKeys = await ApiKey.find({user: req.user._id});
        return res.status(200).json(apiKeys);
    }catch(error){
        return res.status(500).json(error);
    }
}

const getApiKeyById = async (req, res) => {
    const { id } = req.params;
    try{
        const apiKey = await ApiKey.findById(id);
        if(!apiKey){
            return res.status(404).json({message: "No such api key found."});
        }
        return res.status(200).json(apiKey);
    }
    catch(error){
        return res.status(500).json(error);
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
        renewalDate.seteFullYear(renewalDate.getFullYear() + 1);
        apiKey.expiresAt = renewalDate;
        apiKey.save();
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