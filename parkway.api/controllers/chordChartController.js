const mongoose = require('mongoose')
const chordChart = require('../models/chordChartModel')



module.exports = { 
    addProfile, 
    getAll, 
    getById, 
    getByLastName, 
    getByMobileNumber,
    getByHomeNumber, 
    updateProfile, 
    deleteProfile,
    connectUserAndProfile 
}
