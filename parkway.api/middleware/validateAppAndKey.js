const bcrypt = require('bcrypt');
const Application = require('../models/applicationModel'); // Make sure to require your Application model

const validateAppAndKey = async (req, res, next) => {
  const keyHeader = req.headers['x-key'];
  const appHeader = req.headers['x-app'];

  if (!keyHeader || !appHeader) {
    return res.status(401).json({ message: 'Missing header information.' });
  } 
  try {
    const application = await Application.findOne({ currentSecret: appHeader });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const validate = await bcrypt.compare(keyHeader, application.currentKey);
    if (!validate) {
      return res.status(401).json({ message: 'Invalid API Key' });
    }

    if(!application.isActive) {
      return res.status(403).json({message: 'Application is not active'});
    }

    if(application.keyExpiration < new Date()) {
      return res.status(403).json({message: 'API Key expired'});
    }

    //TODO: Implement rate limiting

    next();
  }
  catch (error) {
    console.error('Error validating API key: ', error);
    return res.status(500).json({ message: 'Server error during API key validation', error: error });
  }
};

// const requireAppAndKeyValidation = (router) => {
//     router.use(async (req, res, next) => {
//         await validateAppAndKey(req, res, next); // Ensure async handling is correct
//     });
// };

module.exports = { validateAppAndKey };
