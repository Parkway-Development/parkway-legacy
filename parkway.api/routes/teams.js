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

configureBaseApiRoutes(router, addTeam, getAll, getById, updateTeam, deleteTeam);

//add additional routes here
router.get('/name/:name', getByName)
router.post('/leader/add/:id', addLeader)
router.post('/leader/remove/:id', removeLeader)
router.post('/members/add/:id', addMembers)
router.post('/members/remove/:id', removeMembers)

addNotFoundHandler(router);
module.exports = router;