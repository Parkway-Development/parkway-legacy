// enumsSchema.js
const mongoose = require('mongoose');

const enumSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    values: [{ type: String, required: true }]
});

module.exports = mongoose.model('Enum', enumSchema, 'platform');
