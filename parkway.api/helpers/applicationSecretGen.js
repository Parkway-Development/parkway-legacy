const crypto = require('crypto');

// Function to generate a random API key
function generateApplicationSecret() {
    return crypto.randomBytes(30).toString('hex'); // Generates a 60-character hex string
}

module.exports = { generateApplicationSecret };
