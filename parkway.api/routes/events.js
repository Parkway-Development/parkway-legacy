const express = require('express');
const router = express.Router();
const {
    addEvent,
    getAll,
    getById,
    updateEvent,
    deleteEvent
} = require('../controllers/eventController')

const { requireAuthorization} = require("../auth");
requireAuthorization(router);

//Post an event
router.post('/', addEvent)

//Get all event
router.get('/', getAll)

//Get event by ID
router.get('/:id', getById)

//Update an event by id
router.patch('/:id', updateEvent)

//Delete event by id
router.delete('/:id', deleteEvent)

router.use('*', (req, res) => {
    res.status(404).json({ message: 'Not Found' });
});

module.exports = router;