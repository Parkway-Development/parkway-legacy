const express = require('express');
const { requireAuthorization} = require("../auth");
const router = express.Router();
requireAuthorization(router);

const{
    addPledge,
    getAllPledges,
    getPledgeById,
    getPledgesByProfile,
    updatePledge,
    deletePledge,
} = require('../controllers/pledgeController');

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

router.use('*', (req, res) => {
    res.status(404).json({ message: 'Not Found' });
});

module.exports = router;