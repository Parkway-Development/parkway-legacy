const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        required: true,
        type: String,
        unique: true
    },
    password: {
        required: true,
        type: String
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        type: String
    },
    date: {
        type: Date,
        default: Date.now()
    }
}, {timestamps: true})
module.exports = mongoose.model('User', userSchema, 'users')