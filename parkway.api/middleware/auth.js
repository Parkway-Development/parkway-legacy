const jwt = require('jsonwebtoken');

const authenticateToken = (req, res) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        res.status(401).send('Access denied. No token provided.');
    } 
    
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    }
    catch (error) {
        res.status(403).send('Invalid token.');
    }
};

const requireSpecOpsClaim = (req, res, next) => {
    if (req.user && req.user.isspecops) {
        next();
    } else {
        res.status(403).send('Access denied. Special operations claim is required.');
    }
};

const requireAuthorization = (router) => {
    router.use((req, res, next) => {
        if (authenticateToken(req, res)) {
            next();
        }
    });
};

module.exports = {
    requireAuthorization,
    requireSpecOpsClaim
};
