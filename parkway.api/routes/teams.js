const express = require('express');
const router = express.Router();
const {
    addTeam,
    getAllTeams,
    getTeamById,
    getTeamByName,
    updateTeamById,
    deleteTeamById  
} = require('../controllers/teamController');
const { addNotFoundHandler, configureBaseApiRoutes } = require("./baseApiRouter");

//add additional routes here
router.get('/name/:name', getTeamByName);


configureBaseApiRoutes(router, addTeam, getAllTeams, getTeamById, updateTeamById, deleteTeamById);


addNotFoundHandler(router);
module.exports = router;