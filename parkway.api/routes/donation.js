const express = require('express');
const { requireAuthorization} = require("../auth");
const router = express.Router();
requireAuthorization(router);

const{
    addDonation,
    getAllDonations,
    getDonationById,
    getDonationsByProfile,
    updateDonation,
    deleteDonation
} = require('../controllers/donationController')

//Donations
//Post a donation
router.post('/donations', addDonation)

//Get all donations
router.get('/donations', getAllDonations)

//Get donation by ID
router.get('/donations/:id', getDonationById)

//Get donations by profile
router.get('/donations/profile/:id', getDonationsByProfile)

//Update a donation by ID
router.patch('/donations/:id', updateDonation)

//Delete a donation by ID
router.delete('/donations/:id', deleteDonation)

router.use('*', (req, res) => {
    res.status(404).json({ message: 'Not Found' });
});

module.exports = router;