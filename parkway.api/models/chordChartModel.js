const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chordChartSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true
    },
    chords: {
        type: String,
        required: true
    },
    lyrics: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {timestamps: true})

module.exports = mongoose.model('ChordChart', chordChartSchema, 'chordcharts')