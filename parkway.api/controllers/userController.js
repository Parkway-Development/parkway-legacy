const User = require('../models/userModel')
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRATION})    
}

//login user
const loginUser = async (req, res) => {
    const {email, password} = req.body
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id)
        res.status(200).json({email, token});
    } catch (err) {
        res.status(400).json({err: err.message})
    }
}

//connect user
const signupUser = async (req, res) => {
    const {email, password} = req.body
    try {
        const user = await User.signup(email, password);
        const token = createToken(user._id)
        res.status(201).json({email, token});
    } catch (err) {
        res.status(400).json({err: err.message})
    }
}

//profile

module.exports = { signupUser, loginUser }