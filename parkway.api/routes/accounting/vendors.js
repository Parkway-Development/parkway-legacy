const express = require('express');
const router = express.Router();

const{
    addVendor,
    getAllVendors,
    getVendorById,
    updateVendor,
    deleteVendor,
} = require('../../controllers/accounting/vendorController')

const { addNotFoundHandler, configureBaseApiRoutes } = require("../baseApiRouter");

// const { requireAuthorization} = require("../../middleware/auth");
// requireAuthorization(router);
const { requireAppAndKeyValidation } = require('../../middleware/validateApiKey');
requireAppAndKeyValidation(router);
configureBaseApiRoutes(router, addVendor, getAllVendors, getVendorById, updateVendor, deleteVendor);

const { requireAuthorization} = require("../../middleware/auth");
requireAuthorization(router);

addNotFoundHandler(router);

module.exports = router;