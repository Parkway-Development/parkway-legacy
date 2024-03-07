const mongoose = require('mongoose');
const Team = require('../models/teamModel');
const Profile = require('../models/profileModel');

//Post a team
const addTeam = async (req, res) => {
    const team = new Team({
        name: req.body.name,
        description: req.body.description,
        leader: req.body.leader,
        members: req.body.members
    })

    const teamToSave = await team.save();

    if(!teamToSave){
    return res.status(404).json({message: "The save failed."})}

    res.status(200).json(teamToSave)
}

//Get all teams
const getAll = async (req, res) => {
    const teams = await Team.find({}).sort({teamName: 1});
    if(!teams){
        return res.status(404).json({message: "No teams were returned."})
    }
    res.status(200).json(teams)
}

//Get Team by ID
const getById = async (req, res) => {

    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such team.'})
    }
    const team = await Team.findById(id);

    if(!team){
        return res.status(404).json({message: "No such team found."})
    }
        
    res.status(200).json(team)
}

//Get team by team name
const getByName = async (req, res) => {
    const teams = await Team.find({teamName: req.params.teamName});
    if(!teams){
        return res.status(404).json({message: "No teams found."})
    }
    res.status(200).json(teams)
}

//Update team by ID
const updateTeam = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such team.'})
    }
    const updatedTeam = await Team.findByIdAndUpdate(id, req.body, {new: true});

    if(!updatedTeam){
        return res.status(404).json({message: "No such team found."})
    }
    res.status(200).json(updatedTeam)
}

//Delete team by ID
const deleteTeam = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such team.'})
    }

    //If the team has a leader, update their profile to remove the team
    //Get the team first
    const team = await Team.findById(id);
    if (!team) {
        return res.status(404).json({ message: "No such team found." });
    }

    //If the team has members, update their profiles to remove the team
    const { leader, members } = team;

    // Update the leader's profile
    if (leader) {
        await Profile.findByIdAndUpdate(
            leader,
            { $pull: { teams: id } },
            { new: true }
        );
    }

        // Update all members' profiles
        if (members && members.length > 0) {
            await Promise.all(members.map(memberId =>
                Profile.findByIdAndUpdate(
                    memberId,
                    { $pull: { teams: id } },
                    { new: true }
                )
            ));
        }

    const deletedTeam = await Team.findByIdAndDelete(id);

    if(!deletedTeam){
        return res.status(404).json({message: "No such team found."})
    }
    res.status(200).json(deletedTeam)
}

//Add a leader. If the leader is already a member, remove them from the members list
const addLeader = async (req, res) => {
    const { id } = req.params;
    const { leader } = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such team.'})
    }
    if(!mongoose.Types.ObjectId.isValid(leader)){
        return res.status(404).json({error: 'No such profile.'})
    }

    //If the leader is already a member, remove them from the members list
    const team = await Team.findById(id);

    if(team.members.includes(leader)){
            await Team.findByIdAndUpdate(id, {$pull: {members: leader}});
    }

    //Update the leader's profile to add the team
    const updatedProfile = await Profile.findByIdAndUpdate({_id: leader},{$addToSet: {teams: id}},{new: true})

    if(!updatedProfile){ return res.status(404).json({message: "No such profile found."}) }

    //Update the team to add the leader
    const updatedTeam = await Team.findByIdAndUpdate({_id: id},{leader: leader},{new: true});

    if(!updatedTeam){ return res.status(404).json({message: "No such team found."}) }

    return res.status(200).json({ team: updatedTeam, profile: updatedProfile })
}

const removeLeader = async (req, res) => {
    const { id: teamId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
        return res.status(404).json({ error: 'No such team.' });
    }

    const team = await Team.findByIdAndUpdate(teamId)
    if (!team) {
        return res.status(404).json({ message: "No such team found." });
    }

    const { leader } = team;
    if (!leader) {
        return res.status(404).json({ message: "No leader assigned for this team." });
    }

    const updatedTeam = await Team.findByIdAndUpdate(
        teamId,
        {$unset: {leader: ""}},
        {new: true}
    );

    const updatedProfile = await Profile.findByIdAndUpdate(
        leader,
        { $pull: { teams: teamId } },
        { new: true }
    );

    if (!updatedProfile) {
        return res.status(404).json({ message: "No such profile found." });
    }

    res.status(200).json({team: updatedTeam, profile: updatedProfile});
}

const addMembers = async (req, res) => {
    const { id } = req.params; // Change from teamId to id
    const { members } = req.body; // Assuming this is an array of member IDs

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such team.' });
    }

    // Validate each member ID
    const rejectedMembers = [];
    const validMemberIds = [];
    for (const memberId of members) {
        if (!mongoose.Types.ObjectId.isValid(memberId)) {
            rejectedMembers.push({ memberId, reason: 'Invalid ID' });
            continue;
        }
        validMemberIds.push(memberId);
    }

    if (validMemberIds.length === 0) {
        return res.status(404).json({ error: 'No valid profile IDs provided.', rejectedMembers });
    }

    try {
        // Retrieve the current team information
        const team = await Team.findById(id); // Change from teamId to id
        if (!team) {
            return res.status(404).json({ message: "No such team found." });
        }

        // Filter out any member IDs that match the team's leader and add them to rejected members if necessary
        const nonLeaderMembers = [];
        validMemberIds.forEach(id => {
            if (id.toString() === team.leader.toString()) {
                rejectedMembers.push({ memberId: id, reason: 'Member is the team leader' });
            } else {
                nonLeaderMembers.push(id);
            }
        });

        // Update the team with the new member IDs, avoiding adding the leader as a member
        const updatedTeam = await Team.findByIdAndUpdate(
            id, // Change from teamId to id
            { $addToSet: { members: { $each: nonLeaderMembers } } }, 
            { new: true }
        );

        // Update each member's profile (except for the team leader and invalid members)
        const updates = nonLeaderMembers.map(memberId =>
            Profile.findByIdAndUpdate(
                memberId,
                { $addToSet: { teams: id } }, // Change from teamId to id
                { new: true }
            )
        );
        await Promise.all(updates);

        // Respond with the updated team and any rejected member IDs
        res.status(200).json({ updatedTeam, rejectedMembers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const removeMembers = async (req, res) => {
    const { id } = req.params; // Change from teamId to id
    const { members } = req.body; // Assuming this is an array of member IDs

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such team.' });
    }

    // Validate each member ID
    const rejectedMembers = [];
    const validMemberIds = [];
    for (const memberId of members) {
        if (!mongoose.Types.ObjectId.isValid(memberId)) {
            rejectedMembers.push({ memberId, reason: 'Invalid ID' });
            continue;
        }
        validMemberIds.push(memberId);
    }

    if (validMemberIds.length === 0) {
        return res.status(404).json({ error: 'No valid profile IDs provided.', rejectedMembers });
    }

    try {
        // Retrieve the current team information
        const team = await Team.findById(id); // Change from teamId to id
        if (!team) {
            return res.status(404).json({ message: "No such team found." });
        }

        // Filter out any member IDs that match the team's leader and add them to rejected members if necessary
        const nonLeaderMembers = [];
        validMemberIds.forEach(id => {
            if (id.toString() === team.leader.toString()) {
                rejectedMembers.push({ memberId: id, reason: 'Member is the team leader' });
            } else {
                nonLeaderMembers.push(id);
            }
        });

        // Update the team with the new member IDs, avoiding adding the leader as a member
        const updatedTeam = await Team.findByIdAndUpdate(
            id, // Change from teamId to id
            { $pull: { members: { $in: nonLeaderMembers } } }, 
            { new: true }
        );

        // Update each member's profile (except for the team leader and invalid members)
        const updates = nonLeaderMembers.map(memberId =>
            Profile.findByIdAndUpdate(
                memberId,
                { $pull: { teams: id } }, // Change from teamId to id
                { new: true }
            )
        );
        await Promise.all(updates);

        // Respond with the updated team and any rejected member IDs
        res.status(200).json({ updatedTeam, rejectedMembers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    addTeam,
    getAll,
    getById,
    getByName,
    updateTeam,
    deleteTeam,
    addLeader,
    addMembers,
    removeLeader,
    removeMembers
}