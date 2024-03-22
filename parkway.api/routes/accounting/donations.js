const express = require('express');
const{
    addDonation,
    getAllDonations,
    getDonationById,
    getDonationsByProfile,
    updateDonation,
    deleteDonation
} = require('../../controllers/accounting/donationController')

const { addNotFoundHandler, configureBaseApiRoutes } = require("../baseApiRouter");

const { requireAuthorization} = require("../../auth");

const router = express.Router();

requireAuthorization(router);

//Get donations by profile
router.get('/profile/:id', getDonationsByProfile)

configureBaseApiRoutes(router, addDonation, getAllDonations, getDonationById, updateDonation, deleteDonation);

addNotFoundHandler(router);

module.exports = router;