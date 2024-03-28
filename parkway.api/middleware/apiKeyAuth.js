const ApiKey = require('../models/apiKeyModel');

const apiKeyAuth = async (req, res, next) => {
  try {
    const apiKey = await ApiKey.findOne({ key: req.header('X-API-KEY') });
    if (!apiKey) {
      return res.status(401).send({ error: 'Invalid API key' });
    }
    // Optionally, attach user or apiKey information to the request
    req.apiKey = apiKey;
    next();
  } catch (error) {
    res.status(500).send({ error: 'Internal server error' });
  }
};
