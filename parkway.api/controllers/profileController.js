const mongoose = require('mongoose')
const Profile = require('../models/profileModel')
const User = require('../models/userModel')

const searchForAProfile = async (inboundProfile) => {

    try{
        const inProfile = inboundProfile;
        if(!inboundProfile){ throw new Error("No profile was submitted.") }

        let profile = null;
        if(inProfile.firstName && inProfile.lastName){ profile = await Profile.findOne({firstName: inProfile.firstName, lastName: inProfile.lastName}) } 
        else if(inProfile.mobilePhone){ profile = Profile.findOne({mobilePhone: inProfile.mobilePhone}) }
        else if(inProfile.homePhone){ profile = Profile.findOne({homePhone: inProfile.homePhone}) }
    
        if(!profile){ throw new Error("No profile was found.")}

        profile = await Profile.populate(profile, [{ path: 'family' }, { path: 'preferences' }, { path: 'teams' }]);

        return profile

    } catch (error) {
        console.log(error);    
        return res.status(500).json(error) 
    }
}

const addProfile = async (req, res) => {

    try {
        if(!req.body){ throw new Error("No profile was submitted.")}
        const submittedProfile = new Profile(req.body)

        const existingProfile = await searchForAProfile(submittedProfile)
        if(existingProfile){ throw new Error("There is a possible matching profile. Please check the details and try again.")} 

        const savedProfile = await submittedProfile.save();
        if(!savedProfile){ throw new Error("There was a problem saving the profile.")}
        
        savedProfile = await Profile.populate(savedProfile, [{ path: 'family' }, { path: 'preferences' }, { path: 'teams' }]);

        return res.status(200).json(savedProfile)
    } catch (error) {
        console.log(error);
        return res.status(500).json(error)
    }
}

const getAllProfiles = async (req, res) => {
    try {
        const profiles = await Profile.find({})
        .populate('family')
        .populate('preferences')
        .populate('teams')
        .sort({lastname: 1, firstname: 1});
        if(!profiles){ throw new Error("No profiles were returned.")}

        res.status(200).json(profiles)

    } catch (error) {
        console.log(error);
        return res.status(500).json(error)
    }
}

const getProfileById = async (req, res) => {
    try {
        const {id} = req.params;

        if(!id){ throw new Error("No ID was submitted.")}
        if(!mongoose.Types.ObjectId.isValid(id)){ throw new Error("Invalid ID was submitted.")}
    
        const profile = await Profile.findById(id)
        .populate('family')
        .populate('preferences')
        .populate('teams');

        if(!profile){ throw new Error("No profile was found.")}

        return res.status(200).json(profile)
    } catch (error) {
        console.log(error);
        return res.status(500).json(error)
    }
}

const getProfilesByLastName = async (req, res) => {
    try {
        const {lastName} = req.params;

        if(!lastName){ throw new Error("No last name was submitted.")}

        const profiles = await Profile.find({$text: {$search: lastName}})
            .populate('family')
            .populate('preferences')
            .populate('teams');
    
        if(profiles.length  === 0){ throw new Error("No profiles were found.") }

        res.status(200).json(profiles)
    } catch (error) {
        console.log(error);
        return res.status(500).json(error)
    }
}

const getProfilesByMobilePhone = async (req, res) => {
    try {
        const mobilePhone = req.params;
        if(!mobilePhone){ throw new Error("No mobile phone number was submitted.")}

        const profiles = await Profile.find({mobilePhone: req.params.mobilePhone})
            .populate('family')
            .populate('preferences')
            .populate('teams');
    
        if( profiles.length === 0 ){ throw new Error("No profiles were found.") }

        res.status(200).json(profiles)
    
    }catch (error) {
        console.log(error);
        return res.status(500).json(error)
    }
}

const getProfilesByHomePhone = async (req, res) => {
    try {
        const homePhone = req.params;
        if(!homePhone){ throw new Error("No home phone number was submitted.") }

        const profiles = await Profile.find({homePhone: req.params.homePhone})
            .populate('family')
            .populate('preferences')
            .populate('teams');
    
        if( profiles.length === 0){ throw new Error("No profiles were found.") }

        res.status(200).json(profiles)
    
    } catch (error) {
        console.log(error);
        return res.status(500).json( error )
    }
}

const updateProfile = async (req, res) => {
    try{
        const {id} = req.params;
        if(!id){ throw new Error("No ID was submitted.")}

        if (!mongoose.Types.ObjectId.isValid(id)) { throw new Error("Invalid ID was submitted.") }

        let profile = await Profile.findOneAndUpdate({ _id: id }, 
            { ...req.body }, 
            { new: true }
        );

        if(!profile){ throw new Error("No profile was found.")}

        profile = await Profile.populate(profile, [{ path: 'family' }, { path: 'preferences' }, { path: 'teams' }]);

        return res.status(200).json(profile);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    };
}

const deleteProfile = async (req, res) => {
    try {
        const {id} = req.params.id;
        if(!id){ throw new Error("No ID was submitted.")}

        if(!mongoose.Types.ObjectId.isValid(id)){ throw new Error("Invalid ID was submitted.")}
    
        const profile = await Profile.findOneAndDelete({_id: id});
    
        if(!profile){ throw new Error("No profile was found.")}
    
        res.status(200).json(`The profile for ${profile.firstName + " " + profile.lastName} has been deleted.`)
    
    } catch (error) {
        console.log(error);
        return res.status(500).json(error)
    }
}

const connectUserAndProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        const { profileId } = req.params;
    
        if(!profileId){ throw new Error("No profile ID was submitted.")}    
        if(!userId){ throw new Error("No user ID was submitted.")}    
        if(!mongoose.Types.ObjectId.isValid(userId)){ throw new Error("Invalid user ID was submitted.")}    
        if(!mongoose.Types.ObjectId.isValid(profileId)){ throw new Error("Invalid profile ID was submitted.")}
    
        //get the User and add the profileId to it
        let profile = await Profile.findById(profileId);
        if(!profile){ throw new Error("No profile was found.")}

        const user = await User.findByIdAndUpdate(userId, {profile: profile}, {new: true});
        if(!user){ throw new Error("There was a problem connecting the user to the profile.  The user object was not returned.")}

        //get the Profile and add the userId to it
        profile = await Profile.findByIdAndUpdate(profileId, {user: user}, {new: true});
        if(!profile){ throw new Error("There was a problem connecting the profile to the user.  The profile object was not returned.")}

        profile = await Profile.populate(profile, [{ path: 'family' }, { path: 'preferences' }, { path: 'teams' }]);

        return res.status(200).json(profile)

        // const cleanedProfile = profile.toObject();
        // if(cleanedProfile.user){
        //     delete cleanedProfile.user.password;
        // }
        
        // return res.status(200).json(cleanedProfile)
    
    } catch (error) {
        console.log(error);
        return res.status(500).json(error)
    }
}

module.exports = { 
    addProfile, 
    getAllProfiles, 
    getProfileById, 
    getProfilesByLastName, 
    getProfilesByMobilePhone,
    getProfilesByHomePhone, 
    updateProfile, 
    deleteProfile,
    connectUserAndProfile 
}