const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    value: {
        type: Number,
        required: true
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    depreciationType: {
        type: String,
        required: true,
        default: 'Straight-Line'
    },
    inServiceDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    usefulLifeInDays: {
        type: Number,
        required: true,
        default: 1095
    },
    assetType: {
        type: String
    },
    assetCategory: {
        type: String,
        required: false,
        default: 'Not Categorized'
    },
    assetLocation: {
        type: String
    },
    assetStatus: {
        type: String
    },
    assetCondition: {
        type: String
    },
        notes: [
        String
        ]
    }
)
module.exports = mongoose.model('Asset', assetSchema, 'assets')