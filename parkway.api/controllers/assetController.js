//setup Mongoose
const mongoose = require('mongoose');
//import the necessary models
const Asset = require('../models/assetModel');

//Post an asset
const addAsset = async (req, res) => {
    try {
        const asset = new Asset(req.body);
        await asset.save();
        res.status(201).send(asset);
    } catch (error) {
        res.status(400).send(error);
    }
}

//Get all assets
const getAllAssets = async (req, res) => {
    try {
        const assets = await Asset.find({});
        res.status(200).send(assets);
    } catch (error) {
        res.status(400).send(error);
    }
}

//Get asset by ID
const getAssetById = async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id);
        res.status(200).send(asset);
    } catch (error) {
        res.status(400).send(error);
    }
}

//Get assets by type
const getAssetsByType = async (req, res) => {
    try {
        const assets = await Asset.find({ assetType: req.params.type });
        res.status(200).send(assets);
    } catch (error) {
        res.status(400).send(error);
    }
}

//Get assets by category
const getAssetsByCategory = async (req, res) => {
    try {
        const assets = await Asset.find({ assetCategory: req.params.category });
        res.status(200).send(assets);
    } catch (error) {
        res.status(400).send(error);
    }
}

//Update an asset by ID
const updateAsset = async (req, res) => {
    try {
        await Asset.findByIdAndUpdate
            (req.params.id, req.body
                , { new: true, runValidators: true }
            );
        res.status(200).send('Asset updated');
    }
    catch (error) {
        res.status(400).send(error);
    }
}

//Delete an asset by ID
const deleteAsset = async (req, res) => {
    try {
        await Asset.findByIdAndDelete(req.params.id);
        res.status(200).send('Asset deleted');
    } catch (error) {
        res.status(400).send(error);
    }
}

module.exports = {
    addAsset,
    getAllAssets,
    getAssetById,
    getAssetsByType,
    getAssetsByCategory,
    updateAsset,
    deleteAsset
}