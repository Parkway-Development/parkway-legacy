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

const { addNotFoundHandler, configureBaseApiRoutes } = require("../baseApiRouter");

const { requireAuthorization} = require("../../middleware/auth");
requireAuthorization(router);

//Get assets by name
router.get('/name/:name', getAssetsByName)

//Get assets by type
router.get('/type/:type', getAssetsByType)

//Get assets by category
router.get('/category/:category', getAssetsByCategory)

configureBaseApiRoutes(router, addAsset, getAllAssets, getAssetById, updateAsset, deleteAsset);

addNotFoundHandler(router);

module.exports = router;