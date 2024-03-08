const mongoose = require('mongoose');
class ValidationHelper {
    // Method to remove extra spaces from strings
    static sanitizeString(str) {
        return str.replace(/\s+/g, ' ').trim();
    }
    
    // Validate the id is a valid mongoose id
    static validateId(id) {
        return mongoose.Types.ObjectId.isValid(id);
    }
}

module.exports = ValidationHelper;
