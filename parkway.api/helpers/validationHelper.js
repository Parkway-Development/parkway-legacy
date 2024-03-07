class ValidationHelper {
    // Method to remove extra spaces from strings
    static sanitizeString(str) {
        return str.replace(/\s+/g, ' ').trim();
    }
}

module.exports = ValidationHelper;
