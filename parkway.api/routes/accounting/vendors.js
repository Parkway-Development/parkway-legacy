const express = require('express');
const { requireAuthorization} = require("../../auth");
const router = express.Router();
requireAuthorization(router);

const{
    addVendor,
    getAllVendors,
    getVendorById,
    updateVendor,
    deleteVendor,
} = require('../../controllers/accounting/vendorController')

const { addNotFoundHandler, configureBaseApiRoutes } = require("../baseApiRouter");

configureBaseApiRoutes(router, addVendor, getAllVendors, getVendorById, updateVendor, deleteVendor);

addNotFoundHandler(router);

module.exports = router;