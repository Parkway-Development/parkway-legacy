const express = require('express');
const {
    getEnums,
    getEnumByName,
    addEnum,
    updateEnum,
    deleteEnum
} = require('../controllers/platformController')
const { requireAuthorization} = require("../auth");
const router = express.Router();
requireAuthorization(router);

//Enums
router.get('/enums', getEnums);

//Get enum by name
router.get('/enums/:name', getEnumByName);

//Add enum
router.post('/enums', addEnum);

//Update enum
router.patch('/enums/:name', updateEnum);

//Delete enum
router.delete('/enums/:name', deleteEnum);

router.use('*', (req, res) => {
    res.status(404).json({ message: 'Not Found' });
});

module.exports = router;