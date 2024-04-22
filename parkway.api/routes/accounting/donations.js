const express = require('express');
const router = express.Router();

const{
    addDonation,
    getAllDonations,
    getDonationById,
    getDonationsByProfile,
    updateDonation,
    deleteDonation
} = require('../../controllers/accounting/donationController')

const { addNotFoundHandler, configureBaseApiRoutes } = require("../baseApiRouter");

// const { requireAuthorization} = require("../../middleware/auth");
// requireAuthorization(router);
const { requireAppAndKeyValidation } = require('../../middleware/validateApiKey');
requireAppAndKeyValidation(router);
configureBaseApiRoutes(router, addDonation, getAllDonations, getDonationById, updateDonation, deleteDonation);

//Get donations by profile
router.get('/profile/:id', getDonationsByProfile)

addNotFoundHandler(router);

module.exports = router;