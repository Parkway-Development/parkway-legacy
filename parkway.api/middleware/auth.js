const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]

    if (token ) {
        try {
            req.user = jwt.verify(token, process.env.JWT_SECRET)
        }catch (err) {
            return res.status(403).send('Invalid token.');
        }
    }
    else {
        return res.status(401).send('Access denied.');
    }
    
    next();
};

// const requireAuthorization = (router) => {
//     router.use((req, res, next) => {
//         if (authenticateToken(req, res)) {
//             next();
//         }
//     });
// };

module.exports = {
    authenticateToken
};
