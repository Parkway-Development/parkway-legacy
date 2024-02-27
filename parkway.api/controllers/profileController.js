const mongoose = require('mongoose')
const Profile = require('../models/profileModel')
const User = require('../models/userModel')

//Post a profile
const addProfile = async (req, res) => {
    const profile = new Profile({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        middleinitial: req.body.middleinitial,
        nickname: req.body.nickname,
        dateofbirth: req.body.dateofbirth,
        gender: req.body.gender,
        email: req.body.email,
        mobile: req.body.mobile,
        streetaddress1: req.body.streetaddress1,
        streetaddress2: req.body.streetaddress2,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        userId: req.body.userId,
        member: req.body.member,
        status: req.body.status,
        applicationrole: req.body.applicationrole,
        
    })

    const profileToSave = await profile.save();

    if(!profileToSave){
    return res.status(404).json({mssg: "The save failed."})}

    res.status(200).json(profileToSave)
}

//Get all profiles
const getAll = async (req, res) => {
    const profiles = await Profile.find({}).sort({lastname: 1, firstname: 1});
    if(!profiles){
        return res.status(404).json({mssg: "No profiles were returned."})
    }
    res.status(200).json(profiles)
}

//Get Profile by ID
const getById = async (req, res) => {

    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such profile.'})
    }
    const profile = await Profile.findById(id);

    if(!profile){
        return res.status(404).json({mssg: "No such profile found."})
    }
        
    res.status(200).json(profile)
}

//Get profile by last name
const getByLastName = async (req, res) => {
    const profiles = await Profile.find({lastname: req.params.lastname});
    if(!profiles){
        return res.status(404).json({mssg: "No profiles found."})
    }
    res.status(200).json(profiles)
}

//Get profiles by mobile number
const getByMobile = async (req, res) => {
    const profiles = await Profile.find({mobile: req.params.mobile});
    if(!profiles){
        return res.status(404).json({mssg: "No profiles found."})
    }
    res.status(200).json(profiles)
}

//Update profile by ID
const updateProfile = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such profile.'})
    }

    const profile = await Profile.findOneAndUpdate({_id: id}, {
        ...req.body
    },
    {
        new: true
    })

    if(!profile){
        return res.status(404).json({error: "There was a problem updating the profile."})
    }

    res.status(200).json(profile)
}

//Delete profile by ID
const deleteProfile = async (req, res) => {
    const id = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such profile.'})
    }

    const profile = await Profile.findOneAndDelete({_id: id});

    if(!profile){
        return res.status(500).json({mssg: "Something went wrong with the deletion."})
    }

    res.status(200).json(`The profile for ${profile.firstname + " " + profile.lastname} has been deleted.`)
}

//Join a profile to a user
const connectUserAndProfile = async (req, res) => {

    const { userId } = req.body;
    const { profileId } = req.params;

    if(!profileId){
        return res.status(400).json({error: 'No such profile for: ' + profileId})
    }

    if(!userId){
        return res.status(400).json({error: 'Required parameters not supplied in body.'})
    }

    if(!mongoose.Types.ObjectId.isValid(userId)){
        return res.status(404).json({error: 'No such user account.'})
    }

    if(!mongoose.Types.ObjectId.isValid(profileId)){
        return res.status(404).json({error: 'No such profile.'})
    }

    //Make sure the user account exists
    const user = await User.findById(userId);

    if(!user){
        return res.status(404).json({error: 'No such user account.'})
    }

    //Update the profile with the user account
    const profile = await Profile.findByIdAndUpdate({_id: profileId}, {userId: userId},{new: true})

    if(!profile){
        return res.status(404).json({error: "There was a problem updating the profile."})
    }

    //Update the profile with user account
    const newUser = await User.findByIdAndUpdate({_id: userId}, { profileId: profileId}, {new: true})

    if(!newUser){
        return res.status(404).json({error: "There was a problem updating the user account."})
    }

    res.status(200).json(profile)
}

module.exports = { 
    addProfile, 
    getAll, 
    getById, 
    getByLastName, 
    getByMobile, 
    updateProfile, 
    deleteProfile,
    connectUserAndProfile 
}