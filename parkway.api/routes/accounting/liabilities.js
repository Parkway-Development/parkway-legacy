const express = require('express');
const { requireAuthorization} = require("../../auth");
const router = express.Router();
requireAuthorization(router);

const{
    addLiability,
    getAllLiabilities,
    getLiabilityById,
    getLiabilitiesByFund,
    getLiabilitiesByCategory,
    updateLiability,
    deleteLiability
} = require('../../controllers/accounting/liabilityController')

//Post a liability
router.post('/liabilities', addLiability)

//Get all liabilities
router.get('/liabilities', getAllLiabilities)

//Get liability by ID
router.get('/liabilities/:id', getLiabilityById)

//Get liabilities by fund
router.get('/liabilities/fund/:id', getLiabilitiesByFund)

//Get liabilities by category
router.get('/liabilities/category/:category', getLiabilitiesByCategory)

//Update a liability by ID
router.patch('/liabilities/:id', updateLiability)

//Delete a liability by ID
router.delete('/liabilities/:id', deleteLiability)

router.use('*', (req, res) => {
    res.status(404).json({ message: 'Not Found' });
});

module.exports = router;