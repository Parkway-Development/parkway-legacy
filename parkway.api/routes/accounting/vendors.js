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

const { requireAuthorization} = require("../../middleware/auth");
requireAuthorization(router);

configureBaseApiRoutes(router, addVendor, getAllVendors, getVendorById, updateVendor, deleteVendor);

addNotFoundHandler(router);

module.exports = router;