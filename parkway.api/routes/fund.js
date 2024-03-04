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
router.post('/funds', addFund)

//Get all funds
router.get('/funds', getAllFunds)

//Get fund by ID
router.get('/funds/:id', getFundById)

//Get a fund by name
router.get('/funds/name/:name', getFundsByName)

//Update a fund by ID
router.patch('/funds/:id', updateFund)

//Delete a fund by ID
router.delete('/funds/:id', deleteFund)

router.use('*', (req, res) => {
    res.status(404).json({ message: 'Not Found' });
});

module.exports = router;