const express = require('express');
const router = express.Router();
const {
    addTeam,
    getAll,
    getById,
    getByName,
    updateTeam,
    deleteTeam,
    addLeader,
    removeLeader,
    addMembers,
    removeMembers
} = require('../controllers/teamController')

const { requireAuthorization} = require("../auth");
requireAuthorization(router);

//Post a team
router.post('/', addTeam)

//Get all teams
router.get('/', getAll)

//Get team by ID
router.get('/:id', getById)

//Get teams by team name
router.get('/name/:name', getByName)

//Update a team by id
router.patch('/:id', updateTeam)

//Delete team by id
router.delete('/:id', deleteTeam)

//Add a leader
router.post('/leader/add/:id', addLeader)

//Add a member
router.post('/leader/remove/:id', removeLeader)

//add multiple members
router.post('/members/add/:id', addMembers)

//remove multiple members
router.post('/members/remove/:id', removeMembers)

router.use('*', (req, res) => {
    res.status(404).json({ message: 'Not Found' });
});

module.exports = router;