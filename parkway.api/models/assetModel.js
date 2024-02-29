const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
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
        default: 'straight-line'
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
        type: String,
        required: false
    },
    assetCategory: {
        type: String,
        required: false
    },
    assetLocation: {
        type: String,
        required: false
    },
    assetStatus: {
        type: String,
        required: false
    },
    assetCondition: {
        type: String,
        required: false
    },
        notes: {
        type: String,
        required: false
    }
})
module.exports = mongoose.model('Asset', assetSchema, 'assets')