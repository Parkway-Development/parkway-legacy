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

const populateClaims = (req) => {
    // Skip if already populated
    if (req.claims) return;

    try {
        const authHeader = req.header('Authorization');
        const token = authHeader && authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded._id;
        req.claims = decoded.claims;
    } catch (err) {
        console.error('Error populating claims: ', err);
    }
};

const hasClaim = (req, requiredClaim) => {
    if (!requiredClaim) {
        return false;
    }

    populateClaims(req);
    const claims = req.claims;

    if (!claims) {
        return false;
    }

    try {
        const claimsToCheck = Array.isArray(requiredClaim) ? requiredClaim : [requiredClaim];
        claimsToCheck.push('isspecops');

        for (const claimToCheck of claimsToCheck) {
            if (claimToCheck && claimToCheck.length > 0) {
                const foundClaim = claims[claimToCheck];

                if (foundClaim && (foundClaim === true || foundClaim === 'true')) {
                    return true;
                }
            }
        }

        return true;
    } catch (error) {
        return false;
    }
};

module.exports = {
    authenticateToken,
    hasClaim
};
