const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const arrangementSchema = new Schema({
    vocalist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: false
    },
    key: {
        type: String,
        required: true
    },
    arrangementName: {
        type: String,
        required: true
    },
    arrangementDescription: {
        type: String
    },
    documents: [{
        fileName: String,
        filePath: String,
        fileType: String
    }]
}, {_id: false});

const chordChartSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String
    },
    tempo: {
        type: Number
    },
    timeSignature: {
        type: String
    },
    artists: [
        String
    ],
    ccliLicense: {
        type: String
    },
    ccliSongNumber: {
        type: String
    },
    copyrights:[
        String,
    ],
    arrangements: {
        type: [arrangementSchema],
        required: true,
        minlength: 1
    },
}, {timestamps: true})

module.exports = mongoose.model('ChordChart', chordChartSchema, 'chordcharts')