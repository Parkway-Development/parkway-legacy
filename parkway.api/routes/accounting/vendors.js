const express = require('express');
const { requireAuthorization} = require("../../auth");
const router = express.Router();
requireAuthorization(router);

const{
    addVendor,
    getAllVendors,
    getVendorById,
    updateVendor,
    deleteVendor,
} = require('../../controllers/accounting/vendorController')

//Post a vendor
router.post('/', addVendor)

//Get all vendors
router.get('/', getAllVendors)

//Get vendor by ID
router.get('/:id', getVendorById)

//Update a vendor by ID
router.patch('/:id', updateVendor)

//Delete a vendor by ID
router.delete('/:id', deleteVendor)

router.use('*', (req, res) => {
    res.status(404).json({ message: 'Not Found' });
});

module.exports = router;