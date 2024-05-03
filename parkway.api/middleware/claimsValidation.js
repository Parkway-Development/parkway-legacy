const User = require('../models/userModel')

const requireSpecOpsClaim = async (req, res, next) => {
    console.log('req.user: ', req.user);
    console.log('req.user.id: ', req.user._id);

    try {
        const id = req.user._id;
        if(!id){ throw new Error ("Invalid id.") }

        const user = await User.findById(id);
        if(!user){ throw new Error ("No such user found.") }

        const hasSpecOpsClaim = user.applicationClaims.some(claim => claim.name === 'isspecops' && claim.value === 'true');
        if(!hasSpecOpsClaim){ throw new Error ("You aint got what it takes.")}

        next();
    } catch (error) {
        console.log('requireSpecOpsClaimError: ', error);
    }
};

module.exports = { requireSpecOpsClaim };