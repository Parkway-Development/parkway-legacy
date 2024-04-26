const express = require('express');
const router = express.Router();
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
const { addNotFoundHandler, configureBaseApiRoutes } = require('../baseApiRouter');

configureBaseApiRoutes(router, addAsset, getAllAssets, getAssetById, updateAsset, deleteAsset);

//add additional routes here
router.get('/name/:name', getAssetsByName)
router.get('/type/:type', getAssetsByType)
router.get('/category/:category', getAssetsByCategory)

addNotFoundHandler(router);
module.exports = router;