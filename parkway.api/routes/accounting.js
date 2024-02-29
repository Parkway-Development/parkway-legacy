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
    deleteDonation,
    addPledge,
    getAllPledges,
    getPledgeById,
    getPledgesByProfile,
    updatePledge,
    deletePledge
} = require('../controllers/accountingController')

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

//Pledges
//Post a pledge
router.post('/pledges', addPledge)

//Get all pledges
router.get('/pledges', getAllPledges)

//Get pledge by ID
router.get('/pledges/:id', getPledgeById)

//Get pledges by profile
router.get('/pledges/profile/:id', getPledgesByProfile)

//Update a pledge by ID
router.patch('/pledges/:id', updatePledge)

//Delete a pledge by ID
router.delete('/pledges/:id', deletePledge)

module.exports = router;