const express = require('express');
const { requireAuthorization} = require("../../auth");
const router = express.Router();
requireAuthorization(router);

const{
    addAsset,
    getAllAssets,
    getAssetById,
    getAssetsByName,
    getAssetsByType,
    getAssetsByCategory,
    updateAsset,
    deleteAsset
} = require('../../controllers/accounting/assetController')

//Get assets by name
router.get('/name/:name', getAssetsByName)

//Get assets by type
router.get('/type/:type', getAssetsByType)

//Get assets by category
router.get('/category/:category', getAssetsByCategory)

//Get asset by ID
router.get('/:id', getAssetById)

//Update an asset by ID
router.patch('/:id', updateAsset)

//Delete an asset by ID
router.delete('/:id', deleteAsset)

//Post an asset
router.post('/', addAsset)

//Get all assets
router.get('/', getAllAssets)

//Default route
router.use('*', (req, res) => {
    res.status(404).json({ error: 'Route Not Found' });
});

module.exports = router;