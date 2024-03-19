const express = require('express');
const router = express.Router();
const {
    addEventCategory,
    getAll,
    getById,
    updateEventCategory,
    deleteEventCategory
} = require('../controllers/eventCategoryController')

const { requireAuthorization} = require("../auth");
requireAuthorization(router);

//Post an event category
router.post('/', addEventCategory)

//Get all event categories
router.get('/', getAll)

//Get event category by ID
router.get('/:id', getById)

//Update an event category by id
router.patch('/:id', updateEventCategory)

//Delete event category by id
router.delete('/:id', deleteEventCategory)

router.use('*', (req, res) => {
    res.status(404).json({ message: 'Not Found' });
});

module.exports = router;