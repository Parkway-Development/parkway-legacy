// apiKeyGen.js

const crypto = require('crypto');

// Function to generate a random API key
function generateApiKey() {
    return crypto.randomBytes(30).toString('hex'); // Generates a 60-character hex string
}

module.exports = { generateApiKey };
