const express = require('express');
const router = express.Router();
const {
    addTeam,
    getAll,
    getById,
    getByTeamName,
    getByTeamType,
    updateTeam,
    deleteTeam
} = require('../controllers/teamController')
