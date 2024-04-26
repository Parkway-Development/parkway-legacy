const requireSpecOpsClaim = (req, res, next) => {
    if (req.user && req.user.isspecops) {
        next();
    } else {
        res.status(403).send('Access denied. You aint got what it takes.');
    }
};

module.exports = { requireSpecOpsClaim };