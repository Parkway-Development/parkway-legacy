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
const { requireAppAndKeyValidation } = require('../middleware/validateApiKey');
const { requireAuthorization} = require("../middleware/auth");
requireAuthorization(router);
requireAppAndKeyValidation(router);
addNotFoundHandler(router);
configureBaseApiRoutes(router, addTeam, getAll, getById, updateTeam, deleteTeam);

router.get('/name/:name', getByName)
router.post('/leader/add/:id', addLeader)
router.post('/leader/remove/:id', removeLeader)
router.post('/members/add/:id', addMembers)
router.post('/members/remove/:id', removeMembers)

module.exports = router;