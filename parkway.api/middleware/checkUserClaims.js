const checkUserClaim = (req, res, next) => {
    // Assuming user claims are stored in req.user.claims
    const claims = req.user.claims;

    // Check if 'ispsecops' claim exists and its value
    if (claims && claims.ispsecops) {
        if (claims.ispsecops === true) {
            return next();  // Proceed if the claim is true
        } else {
            // Handle the case where claim exists but is not true
            return res.status(403).json({ message: 'Access denied. Required user claim not valid.' });
        }
    } else {
        // Handle the case where claim does not exist
        return res.status(403).json({ message: 'Access denied. Required user claim is missing.' });
    }
};
