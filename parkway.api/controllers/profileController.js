const mongoose = require('mongoose')
const Profile = require('../models/profileModel')
const User = require('../models/userModel')

//Search for a pre-existing profile
const searchForAProfile = async (inboundProfile) => {

    const inProfile = inboundProfile;

    let profile = null;
    if(inProfile.firstName && inProfile.lastName){
        profile = await Profile.findOne({firstName: inProfile.firstName, lastName: inProfile.lastName})} 
    else if(inProfile.mobilePhone){
        profile = Profile.findOne({mobilePhone: inProfile.mobilePhone}) }
    else if(inProfile.homePhone){
        profile = Profile.findOne({homePhone: inProfile.homePhone}) }

    if(!profile){
        return null}
    return profile
}

//Post a profile
const addProfile = async (req, res) => {
    const submittedProfile = new Profile(req.body)

    const existingProfile = await searchForAProfile(submittedProfile)
    if(existingProfile){
        return res.status(400).json({
            submittedProfile,
            existingProfile: existingProfile, 
            message: "There is a possible matching profile. Please check the details and try again."})
    }

    const savedProfile = await submittedProfile.save();

    if(!savedProfile){
    return res.status(404).json({message: "The save failed."})}

    res.status(200).json(savedProfile)
}

//Get all profiles
const getAll = async (req, res) => {
    const profiles = await Profile.find({})
        .populate('family')
        .populate('preferences')
        .populate('teams')
        .sort({lastname: 1, firstname: 1});
    if(!profiles){
        return res.status(404).json({message: "No profiles were returned."})
    }
    res.status(200).json(profiles)
}

//Get Profile by ID
const getById = async (req, res) => {

    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such profile.'})
    }
    const profile = await Profile.findById(id)
        .populate('family')
        .populate('preferences')
        .populate('teams');

    if(!profile){
        return res.status(404).json({message: "No such profile found."})
    }
        
    res.status(200).json(profile)
}

//Get profile by last name
const getByLastName = async (req, res) => {

    const { lastName } = req.params;

    const profiles = await Profile.find({$text: {$search: lastName}})
        .populate('family')
        .populate('preferences')
        .populate('teams');

    if(profiles.length  === 0){
        return res.status(404).json({message: "No profiles found."})
    }
    res.status(200).json(profiles)
}

//Get profiles by mobile number
const getByMobileNumber = async (req, res) => {
    const { mobileNumber } = req.params;
    const profiles = await Profile.find({mobileNumber: req.params.mobileNumber})
        .populate('family')
        .populate('preferences')
        .populate('teams');

    if(!profiles){
        return res.status(404).json({message: "No profiles found."})
    }
    res.status(200).json(profiles)
}

//Get profiles by home number
const getByHomeNumber = async (req, res) => {
    const { homeNumber } = req.params;
    const profiles = await Profile.find({homeNumber: req.params.homeNumber})
        .populate('family')
        .populate('preferences')
        .populate('teams');

    if(!profiles){
        return res.status(404).json({message: "No profiles found."})
    }
    res.status(200).json(profiles)
}

//Update profile by ID
const updateProfile = async (req, res) => {
    try{
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'No such profile.' });
        }

        let profile = await Profile.findOneAndUpdate({ _id: id }, 
            { ...req.body }, 
            { new: true }
        );

        if (profile) {
            profile = await Profile.populate(profile, [{ path: 'family' }, { path: 'preferences' }, { path: 'teams' }]);
            return res.status(200).json(profile);
        } else {
            return res.status(404).json({ error: "There was a problem updating the profile." });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "There was a problem updating the profile." });
    };
}

//Delete profile by ID
const deleteProfile = async (req, res) => {
    const id = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such profile.'})
    }

    const profile = await Profile.findOneAndDelete({_id: id});

    if(!profile){
        return res.status(500).json({message: "Something went wrong with the deletion."})
    }

    res.status(200).json(`The profile for ${profile.firstName + " " + profile.lastName} has been deleted.`)
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

    //get the User and add the profileId to it
    let profile = await Profile.findById(profileId);
    const user = await User.findByIdAndUpdate(userId, {profile: profile}, {new: true});

    if(!user){
        return res.status(404).json({error: 'There was a problem connecting the user to the profile.  The user object was not returned.'})
    }
    
    //get the Profile and add the userId to it
    profile = await Profile.findByIdAndUpdate(profileId, {user: user}, {new: true});
    if(!profile){
        return res.status(404).json({error: 'There was a problem connecting the profile to the user.  The profile object was not returned.'})
    }

    profile = await Profile.findById(profile._id).populate('user','family preferences teams').exec()

    const cleanedProfile = profile.toObject();
    if(cleanedProfile.user){
        delete cleanedProfile.user.password;
    }
    
    return res.status(200).json(cleanedProfile)
}

module.exports = { 
    addProfile, 
    getAll, 
    getById, 
    getByLastName, 
    getByMobileNumber,
    getByHomeNumber, 
    updateProfile, 
    deleteProfile,
    connectUserAndProfile 
}