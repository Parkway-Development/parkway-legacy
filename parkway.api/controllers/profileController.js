const mongoose = require('mongoose')
const Profile = require('../models/profileModel')
const User = require('../models/userModel')
const appErrors = require('../applicationErrors')

const parkwayId = '6655f7bfb4b37e6e6a743b65'  

const mapToLimitedProfile = (user) => {
    return {
        _id: user._id,
        firstName: user.firstName,
        middleInitial: user.middleInitial,
        lastName: user.lastName,
        nickname: user.nickname
    };
}

const searchForAProfile = async (inboundProfile) => {
    try{
        const inProfile = inboundProfile;
        if(!inboundProfile){ throw new Error("No profile was submitted.") }

        let profile = null;
        if(inProfile.firstName && inProfile.lastName){ profile = await Profile.findOne({firstName: inProfile.firstName, lastName: inProfile.lastName}) } 
        else if(inProfile.mobilePhone){ profile = Profile.findOne({mobilePhone: inProfile.mobilePhone}) }
        else if(inProfile.homePhone){ profile = Profile.findOne({homePhone: inProfile.homePhone}) }
    
        if(!profile) { return null; }

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

        // stop gap for org issue
        if(!submittedProfile.organizationId){ submittedProfile.organizationId = parkwayId }

        const existingProfile = await searchForAProfile(submittedProfile)
        if(existingProfile){ throw new Error("There is a possible matching profile. Please check the details and try again.")} 

        const savedProfile = await submittedProfile.save();
        if(!savedProfile){ throw new Error("There was a problem saving the profile.")}
        
        await Profile.populate(savedProfile, [{ path: 'preferences' }, { path: 'teams' }]);

        return res.status(200).json(savedProfile)
    } catch (error) {
        console.log(error);
        return res.status(500).json(error)
    }
}

const getAllProfiles = async (req, res, next) => {
    try {
        const populate = req.query.populate;
        let profiles;
        if(!populate){ profiles = await Profile.find({}).sort({lastName: 1, firstName: 1}); } 
        else { profiles = await Profile.find({}).populate('preferences', 'teams').sort({lastName: 1, firstName: 1}); }

        if(!profiles){ return res.status(204).json({message: "No profiles were found."})}

        res.status(200).json(profiles)

    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});        
    }
}

const getAllLimitedProfiles = async (req, res, next) => {
    try {
        const profiles = await Profile.find({})
            .sort({lastname: 1, firstname: 1});

        if(!profiles){ return res.status(204).json({message: 'No profiles were returned.'}) }

        const limitedProfiles = profiles.map(user => mapToLimitedProfile(user));

        res.status(200).json(limitedProfiles);

    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});        
    }
}

const getProfileById = async (req, res, next) => {
    try {
        const {id} = req.params;
        const populate = req.query.populate;

        if(!id){ throw new appErrors.MissingId('getProfileById')}
        if(!mongoose.Types.ObjectId.isValid(id)){ throw new appErrors.InvalidId('getProfileById')}
    
        let profile;
        if(!populate){ profile = await Profile.findById(id); } 
        else { profile = await Profile.findById(id).populate('preferences', 'teams'); }

        if(!profile){ return res.status(204).json({message: "No profile was found."}) }

        return res.status(200).json(profile)
    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});        
    }
}

const getProfilesByLastName = async (req, res, next) => {
    try {
        const {lastName} = req.params;
        const populate = req.query.populate;

        if(!lastName){ throw new appErrors.MissingRequiredParameter('getProfilesByLastName','No last name was submitted')}

        let profiles;
        if(!populate){ profiles = await Profile.find({$text: {$search: lastName}}); }
        else { profiles = await Profile.find({$text: {$search: lastName}}).populate('preferences', 'teams'); }

        if(profiles.length  === 0){ return res.status(204).json({message: 'No profiles were found'}) }

        res.status(200).json(profiles)
        
    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});        
    }
}

const getProfilesByMobilePhone = async (req, res, next) => {
    try {
        const mobilePhone = req.params;
        const populate = req.query.populate;

        if(!mobilePhone){ throw new appErrors.MissingRequiredParameter('getProfilesByMobilePhone','No mobile phone number was submitted')}

        let profiles;
        if(!populate){ profiles = await Profile.find({mobilePhone: mobilePhone}); }
        else { profiles = await Profile.find({mobilePhone: mobilePhone}).populate('preferences', 'teams'); }

        if( profiles.length === 0 ){ return res.status(204).json({message: 'No profiles were found'}) }

        res.status(200).json(profiles)
    
    }catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});        
    }
}

const getProfilesByHomePhone = async (req, res, next) => {
    try {
        const homePhone = req.params;
        const populate = req.query.populate;
        if(!homePhone){ throw new Error("No home phone number was submitted.") }

        let profiles;
        if(!populate){ profiles = await Profile.find({homePhone: homePhone}); }
        else { profiles = await Profile.find({homePhone: homePhone}).populate('preferences', 'teams'); }

        if( profiles.length === 0){ return res.status(204).json({message: 'No profiles were found'}) }

        res.status(200).json(profiles)
    
    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});        
    }
}

const updateProfile = async (req, res, next) => {
    try{
        const {id} = req.params;
        const populate = req.query.populate;

        if(!id){ throw new appErrors.MissingId('updateProfile')}
        if (!mongoose.Types.ObjectId.isValid(id)) { throw new appErrors.InvalidId('updateProfile') }

        let profile;
        if(!populate){ 
            profile = await Profile.findOneAndUpdate({ _id: id }, 
            { ...req.body }, 
            { new: true });
        } 
        else {
            profile = await Profile.findOneAndUpdate({ _id: id },
            { ...req.body },
            { new: true }).populate('preferences', 'teams');
        }

        if(!profile){ return res.status(204).json({message: "No profile was found."}) }

        return res.status(200).json(profile);
    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});        
    };
}

const deleteProfile = async (req, res) => {
    try {
        const {id} = req.params;
        if(!id){ throw new appErrors.MissingId('deleteProfile')}
        if(!mongoose.Types.ObjectId.isValid(id)){ throw new appErrors.InvalidId('deleteProfile')}
    
        const profile = await Profile.findOneAndDelete({_id: id});
    
        if(!profile){ return res.status(204).json({message: 'No profile was deleted.'}) }
    
        res.status(200).json(`The profile for ${profile.firstName} ${profile.lastName} has been deleted.`)
    
    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});        
    }
}

const connectUserAndProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        const { profileId } = req.params;
        const populate = req.query.populate;
    
        if(!userId){ throw new appErrors.MissingId('connectUserAndProfile', 'Missing user id')}
        if(!profileId){ throw new appErrors.MissingId('connectUserAndProfile', 'Missing profile id')}    
        if(!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(profileId)){ throw new appErrors.InvalidId('connectUserAndProfile', 'Invalid user id')}    
        if(!mongoose.Types.ObjectId.isValid(profileId)){ throw new appErrors.InvalidId('connectUserAndProfile', 'Invalid profile id')}    
    
        let profile = await Profile.findById(profileId);
        if(!profile){ return res.status(204).json({message: 'No profile for the profile id was found.'})}

        const user = await User.findByIdAndUpdate(userId, {profile: profile}, {new: true});
        if(!user){ return res.status(204).json({message: 'No user for the user id was found.'})}

        profile = await Profile.findByIdAndUpdate(profileId, {user: user}, {new: true});

        if(populate){ profile.populate('preferences', 'teams') }

        return res.status(200).json(profile)
    
    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});        
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
    connectUserAndProfile,
    getAllLimitedProfiles
}