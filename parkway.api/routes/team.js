const express = require('express');
const router = express.Router();
const {
    addTeam,
    getAll,
    getById,
    getByName,
    updateTeam,
    deleteTeam
} = require('../controllers/teamController')

//Post a team
router.post('/', addTeam)

//Get all teams
router.get('/', getAll)

//Get team by ID
router.get('/id/:id', getById)

//Get teams by team name
router.get('/name/:name', getByName)

//Update a team by id
router.patch('/:id', updateTeam)

//Delete team by id
router.delete('/:id', deleteTeam)

module.exports = router;