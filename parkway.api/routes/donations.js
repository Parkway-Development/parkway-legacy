const express = require('express');
const{
    addDonation,
    getAllDonations,
    getDonationById,
    getDonationsByProfile,
    updateDonation,
    deleteDonation
} = require('../controllers/donationController')

const { requireAuthorization} = require("../auth");

const router = express.Router();

requireAuthorization(router);

//Donations
//Post a donation
router.post('/', addDonation)

//Get all donations
router.get('/', getAllDonations)

//Get donation by ID
router.get('/:id', getDonationById)

//Get donations by profile
router.get('/profile/:id', getDonationsByProfile)

//Update a donation by ID
router.patch('/:id', updateDonation)

//Delete a donation by ID
router.delete('/:id', deleteDonation)

router.use('*', (req, res) => {
    const requestedURL = req.originalUrl;
    res.status(404).json({ message: 'Endpoint ' + req.originalUrl + ' not found' });
});

module.exports = router;