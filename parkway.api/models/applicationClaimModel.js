const mongoose = require('mongoose');

const applicationClaimSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        unique: true 
    },
    description: { 
        type: String
    },
    values:[{
        type: String,
        required: true,
    }]
});

module.exports = mongoose.model('ApplicationClaim', applicationClaimSchema, 'applicationclaims')