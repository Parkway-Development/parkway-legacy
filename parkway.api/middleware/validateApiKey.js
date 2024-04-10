const ApiKey = require('../models/apikey/keyModel');

// Middleware to validate API Key
const validateApiKey = async (req, res, next) => {
  const apiKeyHeader = req.headers['x-api-key'];
  const applicationIdHeader = req.headers['x-application-id'];

  if (!apiKeyHeader || !applicationIdHeader) {
      return res.status(401).json({ message: 'API Key and Application Id are required' });
  }
  try {
        const application = await Application.findById(applicationIdHeader);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        const apiKeyObj = await ApiKey.findOne({application:application._id}).populate('application');
        if(!apiKeyObj){
            return res.status(403).json({message: "API Key not associated with the iven application"});
        }

        // Validate the API key
        const match = await bcrypt.compare(apiKeyHeader, apiKeyObj.key);
        if (!match) {
            return res.status(403).json({ message: 'Invalid API Key' });
        }

        // Check if the API key is expired
        const now = new Date();
        if (apiKeyObj.expiresAt < now) {
            return res.status(403).json({ message: 'API Key expired' });
        }

        //TODO: Implement rate limiting

        // API Key is valid
        next();
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error during API key validation', error: error });
    }
};


module.exports = { validateApiKey };