const express = require('express');
const { requireAuthorization} = require("../auth");
const router = express.Router();
requireAuthorization(router);

const{
    addFund,
    getAllFunds,
    getFundById,
    getFundsByName,
    updateFund,
    deleteFund
} = require('../controllers/fundController')

//Post a fund
router.post('/', addFund)

//Get all funds
router.get('/', getAllFunds)

//Get fund by ID
router.get('/:id', getFundById)

//Get a fund by name
router.get('/name/:name', getFundsByName)

//Update a fund by ID
router.patch('/:id', updateFund)

//Delete a fund by ID
router.delete('/:id', deleteFund)

router.use('*', (req, res) => {
    res.status(404).json({ message: 'Not Found' });
});

module.exports = router;