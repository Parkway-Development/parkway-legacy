const User = require('../models/userModel')
const jwt = require('jsonwebtoken');
const Profile = require('../models/profileModel')

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

//Get All Users
const getAll = async (req, res) => {
    const users = await User.find({}).sort({email: 1});
    if(!users){
        return res.status(404).json({mssg: "No users were returned."})
    }
    res.status(200).json(users)
}

//Join a profile to a user
const connectProfileToUser = async (req, res) => {

    const { userId } = req.params;
    const { profileId } = req.body;

    if(!userId){
        return res.status(400).json({error: 'No such user.'})
    }

    if(!profileId){
        return res.status(400).json({error: 'Required parameters not supplied in body.'})
    }

    if(!mongoose.Types.ObjectId.isValid(profileId)){
        return res.status(404).json({error: 'No such profile.'})
    }

    if(!mongoose.Types.ObjectId.isValid(userId)){
        return res.status(404).json({error: 'No such user.'})
    }

    //Make sure the user account exists
    const profile = await Profile.findById(profileId);

    if(!profile){
        return res.status(404).json({error: 'No such user account.'})
    }

    //Update the profile with the user account
    const user = await User.findByIdAndUpdate({_id: userId}, {
        profileId: profileId
    },
    {
        new: true
    })

    if(!user){
        return res.status(404).json({error: "There was a problem updating the user."})
    }

    res.status(200).json(profile)
}

module.exports = { 
    signupUser, 
    loginUser,
    getAll,
    connectProfileToUser}