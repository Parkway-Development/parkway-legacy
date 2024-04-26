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
configureBaseApiRoutes(router, addDonation, getAllDonations, getDonationById, updateDonation, deleteDonation);

//add additional routes here
router.get('/profile/:id', getDonationsByProfile)

addNotFoundHandler(router);
module.exports = router;