const jwt = require('jsonwebtoken');

const authenticateToken = (req, res) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        res.status(401).send('Access denied. No token provided.');
    } else {
        try {
            req.user = jwt.verify(token, process.env.JWT_SECRET);
            return true;
        } catch (error) {
            res.status(403).send('Invalid token.');
        }
    }

    return false;
};

const requireAuthorization = (router) => {
    router.use((req, res, next) => {
        if (authenticateToken(req, res)) {
            next();
        }
    });
};

module.exports = {
    requireAuthorization
};
