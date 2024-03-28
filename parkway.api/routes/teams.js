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
} = require('../controllers/teamController');

const { addNotFoundHandler, configureBaseApiRoutes } = require("./baseApiRouter");

const { requireAuthorization} = require("../middleware/auth");
requireAuthorization(router);

configureBaseApiRoutes(router, addTeam, getAll, getById, updateTeam, deleteTeam);

//Get teams by team name
router.get('/name/:name', getByName)

//Add a leader
router.post('/leader/add/:id', addLeader)

//Add a member
router.post('/leader/remove/:id', removeLeader)

//add multiple members
router.post('/members/add/:id', addMembers)

//remove multiple members
router.post('/members/remove/:id', removeMembers)

addNotFoundHandler(router);

module.exports = router;