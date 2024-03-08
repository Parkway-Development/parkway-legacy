const mongoose = require('mongoose');
const Asset = require('../../models/accounting/assetModel');
const ValidationHelper = require('../../helpers/validationHelper');

//Post an asset
const addAsset = async (req, res) => {
    if (req.body.name) { req.body.name = ValidationHelper.sanitizeString(req.body.name); }

    const asset = new Asset(req.body);
    
    const validationError = asset.validateSync();
    if (validationError) { return res.status(400).json({ message: validationError.message }) }

    try {
        await asset.save();
        return res.status(201).json(asset);
    } catch (error) {
        console.log(error);
        if (error.code === 11000) { return res.status(400).json({ mongoError: 'Asset already exists with that name.' })};
        return res.status(500).json(error.message);
    }
}

//Get all assets
const getAllAssets = async (req, res) => {

    try {
        const assets = await Asset.find({});
        if(assets.length === 0) return res.status(200).json({ message: 'No assets were returned.' });
        return res.status(200).json(assets);
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

//Get asset by ID
const getAssetById = async (req, res) => {

    if(!req.params.id){ return res.status(400).json({error: 'No Asset ID provided.'})}
    if(!ValidationHelper.validateId(req.params.id)){ return res.status(404).json({error: 'Id is not valid.'}) }

    try {
        const asset = await Asset.findById(req.params.id);
        if(!asset) return res.status(200).json({ message: 'No asset found.' });
        return res.status(200).send(asset);
    } catch (error) {
        return res.status(500).send(error);
    }
}

//Get assets by name
const getAssetsByName = async (req, res) => {

    if(!req.params.name){ return res.status(400).json({error: 'No Asset Name provided.'})}

    try {
        const assets = await Asset.find({ name: req.params.name });
        if(assets.length === 0) return res.status(200).json({ message: 'No assets were returned.' });
        return res.status(200).json(assets);
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

//Get assets by type
const getAssetsByType = async (req, res) => {

    if(!req.params.type){ return res.status(400).json({error: 'No Asset Type provided.'})}

    try {
        const assets = await Asset.find({ assetType: req.params.type });
        if(assets.length === 0) return res.status(200).json({ message: 'No assets were returned.' });
        return res.status(200).json(assets);
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

//Get assets by category
const getAssetsByCategory = async (req, res) => {

    if(!req.params.category){ return res.status(400).json({error: 'No Asset Category provided.'})}

    try {
        const assets = await Asset.find({ assetCategory: req.params.category });
        if(assets.length === 0) return res.status(200).json({ message: 'No assets were returned.' });
        return res.status(200).json(assets);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

//Update an asset by ID
const updateAsset = async (req, res) => {

    if(!req.params.id){ return res.status(400).json({error: 'No Asset ID provided.'})}
    if(!ValidationHelper.validateId(req.params.id)){ return res.status(404).json({error: 'Id is not valid.'}) }
    if(req.body.name){ req.body.name = ValidationHelper.sanitizeString(req.body.name) }

    try {
        let asset = await Asset.findByIdAndUpdate({ _id: req.params.id }, { ...req.body }, { new: true, runValidators: true});
        if(!asset) return res.status(404).json({error: "Update failed."});
        return res.status(200).json(asset);
    }
    catch (error) {
        return res.status(500).send(error.message);
    }
}

//Delete an asset by ID
const deleteAsset = async (req, res) => {

    if(!req.params.id){ return res.status(400).json({error: 'No Asset ID provided.'})}
    if(!ValidationHelper.validateId(req.params.id)){ return res.status(404).json({error: 'Id is not valid.'}) }

    try {
        const asset = await Asset.findByIdAndDelete(req.params.id);
        if(!asset){ return res.status(404).json({message: "Asset could not be found.  Asset was not deleted."})};
        return res.status(200).json({message: "Asset deleted", asset: asset});
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

module.exports = {
    addAsset,
    getAllAssets,
    getAssetById,
    getAssetsByName,
    getAssetsByType,
    getAssetsByCategory,
    updateAsset,
    deleteAsset
}