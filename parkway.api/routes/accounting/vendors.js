const express = require('express');
const router = express.Router();

const{
    addVendor,
    getAllVendors,
    getVendorById,
    updateVendor,
    deleteVendor,
} = require('../../controllers/accounting/vendorController')
const { addNotFoundHandler, configureBaseApiRoutes } = require('../baseApiRouter');

configureBaseApiRoutes(router, addVendor, getAllVendors, getVendorById, updateVendor, deleteVendor);

//add additional routes here

addNotFoundHandler(router);
module.exports = router;
