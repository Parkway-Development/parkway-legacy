const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const appError = require('../applicationErrors');


const authenticateToken = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded._id).populate('organizations.organizationId');
            if (!user) {
                return next(new appError.UserDoesNotExist('authenticateToken'));
            }
            req.user = user;
            next();
        } catch (err) {
            return res.status(403).send('The token is invalid.');
        }
    } else {
        return res.status(401).send('Access denied.');
    }
};

const requireClaim = (req, res, next, requiredClaim) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return next(new appError.AccessDenied('requireClaim'));
    } else {
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = payload._id;

            if (requiredClaim) {
                const claimValue = payload.claims ? payload.claims[requiredClaim] : undefined;

                if (claimValue !== true && claimValue !== 'true') {
                    return next(new appError.AccessDenied('requireClaim'));
                }
            }

            next();
        } catch (error) {
            return res.status(401).send('Invalid token.');
        }
    }
};

module.exports = {
    authenticateToken,
    requireClaim
};
