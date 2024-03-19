const mongoose = require('mongoose');

const eventCategorySchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    backgroundColor: {
        required: true,
        type: String
    },
    fontColor: {
        required: true,
        type: String
    }
});

module.exports = mongoose.model('EventCategory', eventCategorySchema, 'eventCategories')