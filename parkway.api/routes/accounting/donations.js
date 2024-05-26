const express = require('express');
const router = express.Router();
const{
    createDonation,
    getAllDonations,
    getDonationsByDateRange,
    getDonationById,
    getDonationsByProfile,
    updateDonation,
    deleteDonation
} = require('../../controllers/accounting/donationController')

const { addNotFoundHandler, configureBaseApiRoutes } = require('../baseApiRouter');

//add additional routes here
router.get('/profile/:id', getDonationsByProfile)
router.get('/bydaterange', getDonationsByDateRange)

configureBaseApiRoutes(router, createDonation, getAllDonations, getDonationById, updateDonation, deleteDonation);


addNotFoundHandler(router);
module.exports = router;