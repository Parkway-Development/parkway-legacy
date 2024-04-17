
// Middleware to validate API Key
const validateApiKey = async (req, res, next) => {
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

        const validate = bcrypt.compare(keyHeader, application.currentKey);
        if (!validate) {
            return res.status(401).json({ message: 'Invalid API Key' });
        }

        if(!application.isActive){
            return res.status(403).json({message: 'Application is not active'});
        }

        if(application.keyExpiration < new Date()){
            return res.status(403).json({message: 'API Key expired'});
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