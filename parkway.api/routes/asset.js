const express = require('express');
const { requireAuthorization} = require("../auth");
const router = express.Router();
requireAuthorization(router);

const{
    addAsset,
    getAllAssets,
    getAssetById,
    getAssetsByType,
    getAssetsByCategory,
    updateAsset,
    deleteAsset
} = require('../controllers/assetController')

//Post an asset
router.post('/assets', addAsset)

//Get all assets
router.get('/assets', getAllAssets)

//Get asset by ID
router.get('/assets/:id', getAssetById)

//Get assets by type
router.get('/assets/type/:type', getAssetsByType)

//Get assets by category
router.get('/assets/category/:category', getAssetsByCategory)

//Update an asset by ID
router.patch('/assets/:id', updateAsset)

//Delete an asset by ID
router.delete('/assets/:id', deleteAsset)

module.exports = router;