const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, requiredClaim) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        res.status(401).send('Access denied. No token provided.');
    } else {
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            req.user = payload._id;

            if (requiredClaim) {
                const claimValue = payload.claims ? payload.claims[requiredClaim] : undefined;

                if (claimValue !== true) {
                    res.status(403).send('Access denied. Claim not found.');
                    return false;
                }
            }

            return true;
        } catch (error) {
            res.status(401).send('Invalid token.');
        }
    }

    return false;
};

const requireAuthorization = (router, requiredClaim) => {
    router.use((req, res, next) => {
        if (authenticateToken(req, res, requiredClaim)) {
            next();
        }
    });
};

module.exports = {
    requireAuthorization
};
