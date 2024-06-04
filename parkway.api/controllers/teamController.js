const mongoose = require('mongoose');
const Team = require('../models/teamModel');
const Profile = require('../models/profileModel');

const addTeam = async (req, res) => {
    try {
        const { name, description, leader, members } = req.body;
        if (!name) { throw new Error('Team name is required.'); }
    
        const team = new Team({
            name,
            description,
            members: []
        });

        if(!team){ throw new Error('There was a problem saving the team.') }

        if (leader) {
            if(!mongoose.Types.ObjectId.isValid(leader)){ throw new Error('Invalid leader ID.') }
            await addLeaderById(req, res, team, leader);
        }

        if (members && members.length > 0) {
            await addMembersToTeam(req, res, team, members);
        }

        await team.save();

        res.status(200).json(team);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

const getAllTeams = async (req, res) => {
    try {
        const teams = await Team.find({}).sort({teamName: 1});
        if(!teams){ throw new Error('No teams were returned.') }

        res.status(200).json(teams)
    
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

const getTeamById = async (req, res) => {
    try {
        const { id } = req.params;
        if(!id){ throw new Error('No ID provided.')}
        if(!mongoose.Types.ObjectId.isValid(id)){ throw new Error('Invalid ID provided.')}

        const team = await Team.findById(id);
    
        if(!team){ throw new Error('No team found.') }
            
        res.status(200).json(team)
    
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

const getTeamByName = async (req, res) => {
    try {
        const { teamName } = req.params;
        if(!teamName){ throw new Error('No team name provided.')}

        const teams = await Team.find({teamName: req.params.teamName});
        if(!teams){ throw new Error('No teams found.')}

        res.status(200).json(teams)
    
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

const updateTeamById = async (req, res) => {
    try {
        const { id } = req.params;
        if(!id){ throw new Error('No ID provided.')}
        if(!mongoose.Types.ObjectId.isValid(id)){ throw new Error('Invalid ID provided.')}

        const team = await Team.findById(id);
        if (!team) { throw new Error('No team found.'); }

        team.name = req.body.name;
        team.description = req.body.description;

        const { leader, members } = req.body;

        // Check to clear the leader or change the leader
        if (team.leader && leader !== team.leader) {
            await removeLeader(req, res, team);
        }

        // Add the new leader
        if (leader && !team.leader) {
            await addLeaderById(req, res, team, leader);
        }

        // Check if changing members
        if (members) {
            const existingMembers = [...team.members] ?? [];
            const membersToAdd = members.filter((member) => !existingMembers.includes(member));
            if (membersToAdd.length > 0) {
                console.log('adding members', membersToAdd);
                await addMembersToTeam(req, res, team, membersToAdd);
            }

            const membersToRemove = existingMembers.filter((member) => !members.includes(member));
            if (membersToRemove.length > 0) {
                console.log('removing members', membersToRemove);
                await removeMembersFromTeam(req, res, team, membersToRemove);
            }
        }

        await team.save();
        res.status(200).json(team);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

const deleteTeamById = async (req, res) => {
    try {
        const { id } = req.params;
        if(!id){ throw new Error('No ID provided.')}
        if(!mongoose.Types.ObjectId.isValid(id)){ throw new Error('Invalid ID provided.')}
    
        //If the team has a leader, remove the team from the leaders profile
        //If the team has members, remove the team from their profiles
        const team = await Team.findById(id);
        if (!team) { throw new Error('No team found.') }

        const { leader, members } = team;

        if (leader) {
            await removeLeader(req, res, team);
        }

        if (members && members.length > 0) {
            await removeMembersFromTeam(req, res, team, members);
        }

        const deletedTeam = await Team.findByIdAndDelete(id);

        if(!deletedTeam){ throw new Error('There was a problem deleting the team.') }

        res.status(200).json(deletedTeam);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

const addLeaderById = async (req, res, team, leaderId) => {
    try {
        //If the leader is already a team member, remove them from the members list first
        if(team.members.includes(leaderId)) {
            team.members = team.members.filter((member) => member.id !== leaderId);
        }

        //Then add the team to the leader's profile
        const updatedProfile = await Profile.findByIdAndUpdate(leaderId, {$addToSet: {teams: team._id}},{new: true})
        if(!updatedProfile){ throw new Error('There was a problem updating the leaders profile.') }

        team.leader = leaderId;
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

const removeLeader = async (req, res, team) => {
    try {
        const { leader } = team;
        if (!leader) {
            return;
        }

        const leaderId = team.leader;
        team.leader = undefined;

        const updatedProfile = await Profile.findByIdAndUpdate(leaderId, { $pull: { teams: team._id } }, { new: true } );
        if (!updatedProfile) { throw new Error('There was a problem updating the leaders profile.') }
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

const addMembersToTeam = async (req, res, team, members) => {
    try {
        if (members.length === 0){ throw new Error('No members provided.') }

        const goodMemberIds = members.filter((memberId) => mongoose.Types.ObjectId.isValid(memberId) &&
            memberId !== team.leader);

        if (goodMemberIds.length) {
            team.members.push(...goodMemberIds);

            const updates = goodMemberIds.map(memberId =>
                Profile.findByIdAndUpdate(memberId, {$addToSet: {teams: team._id}}, {new: true})
            );

            await Promise.all(updates);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);        
    }
};

const removeMembersFromTeam = async (req, res, team, members) => {
    try {
        if(members.length === 0){ throw new Error('No members provided.') }

        const goodMemberIds = members.filter((memberId) => mongoose.Types.ObjectId.isValid(memberId));

        if (goodMemberIds.length) {
            team.members = team.members.filter((memberId) => !goodMemberIds.includes(memberId));

            const updates = goodMemberIds.map(memberId =>
                Profile.findByIdAndUpdate( memberId, { $pull: { teams: team._id } }, { new: true } )
            );
            await Promise.all(updates);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);             
    }
}

module.exports = {
    addTeam,
    getAllTeams,
    getTeamById,
    getTeamByName,
    updateTeamById,
    deleteTeamById
}