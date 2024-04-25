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
const { requireAppAndKeyValidation } = require('../../middleware/validateApiKey');
const { requireAuthorization} = require('../../middleware/auth');
requireAuthorization(router);
requireAppAndKeyValidation(router);
addNotFoundHandler(router);
configureBaseApiRoutes(router, addAsset, getAllAssets, getAssetById, updateAsset, deleteAsset);

router.get('/name/:name', getAssetsByName)
router.get('/type/:type', getAssetsByType)
router.get('/category/:category', getAssetsByCategory)

module.exports = router;