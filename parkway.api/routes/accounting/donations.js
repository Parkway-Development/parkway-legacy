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

const { addNotFoundHandler, configureBaseApiRoutes } = require('../baseApiRouter');
const { requireAppAndKeyValidation } = require('../../middleware/validateApiKey');
const { requireAuthorization} = require('../../middleware/auth');
requireAuthorization(router);
requireAppAndKeyValidation(router);
addNotFoundHandler(router);
configureBaseApiRoutes(router, addDonation, getAllDonations, getDonationById, updateDonation, deleteDonation);

router.get('/profile/:id', getDonationsByProfile)

module.exports = router;