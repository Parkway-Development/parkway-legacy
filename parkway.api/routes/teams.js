const express = require('express');
const router = express.Router();
const {
    addTeam,
    getAllTeams,
    getTeamById,
    getTeamByName,
    updateTeamById,
    deleteTeamById,
    addLeaderById,
    removeLeaderById,
    addMembersToTeam,
    removeMembersFromTeam
} = require('../controllers/teamController');
const { addNotFoundHandler, configureBaseApiRoutes } = require("./baseApiRouter");

configureBaseApiRoutes(router, addTeam, getAllTeams, getTeamById, updateTeamById, deleteTeamById);

//add additional routes here
router.get('/name/:name', getTeamByName)
router.post('/leader/add/:teamId', addLeaderById)
router.post('/leader/remove/:teamId', removeLeaderById)
router.post('/members/add/:teamId', addMembersToTeam)
router.post('/members/remove/:teamId', removeMembersFromTeam)

addNotFoundHandler(router);
module.exports = router;