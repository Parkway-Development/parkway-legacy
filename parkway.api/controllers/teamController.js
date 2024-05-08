const mongoose = require('mongoose');
const Team = require('../models/teamModel');
const Profile = require('../models/profileModel');

const addTeam = async (req, res) => {
    try {
        const { name, description, leader, members } = req.body;
        if (!name) { throw new Error('Team name is required.'); }
    
        const team = new Team({
            name: req.body.name,
            description: req.body.description,
            leader: req.body.leader,
            members: req.body.members
        }).save();

        if(!team){ throw new Error('There was a problem saving the team.') }

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

        const updatedTeam = await Team.findByIdAndUpdate(id, req.body, {new: true});
    
        if(!updatedTeam){ throw new Error('No team found.') }

        res.status(200).json(updatedTeam)
    
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

        if (leader) { await Profile.findByIdAndUpdate( leader, { $pull: { teams: id } }); }

        if (members && members.length > 0) {
            await Promise.all(members.map(memberId =>
                Profile.findByIdAndUpdate( memberId, { $pull: { teams: id } } )
            ));
        }

        const deletedTeam = await Team.findByIdAndDelete(id);

        if(!deletedTeam){ throw new Error('There was a problem deleting the team.') }

        res.status(200).json(deletedTeam)
    
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }

}

const addLeaderById = async (req, res) => {
    try {
        const { teamId } = req.params;
        if(!teamId){ throw new Error('No team ID provided.') }
        if(!mongoose.Types.ObjectId.isValid(teamId)){ throw new Error('Invalid team ID.') }

        const { leaderId } = req.body;
        if(!leaderId){ throw new Error('No leader ID provided.') }
        if(!mongoose.Types.ObjectId.isValid(leaderId)){ throw new Error('Invalid leader ID.') }

        //Get the team in question
        const team = await Team.findById(teamId);
        if(!team){ throw new Error('No such team found.') }

        //If the leader is already a team member, remove them from the members list first
        if(team.members.includes(leaderId)){ await Team.findByIdAndUpdate(leaderId, {$pull: {members: leaderId}});}

        //Then add the team to the leader's profile
        const updatedProfile = await Profile.findByIdAndUpdate({_id: leaderId},{$addToSet: {teams: teamId}},{new: true})
        if(!updatedProfile){ throw new Error('There was a problem updating the leaders profile.') }

        //Then add the leader to the team
        const updatedTeam = await Team.findByIdAndUpdate({_id: teamId},{leader: leaderId},{new: true});
        if(!updatedTeam){ throw new Error('There was a problem updating the team with the new leader.') }

        return res.status(200).json({ team: updatedTeam, profile: updatedProfile })
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }

}

const removeLeaderById = async (req, res) => {
    try {
        const { teamId } = req.params;
        if(!teamId){ throw new Error('No team ID provided.') }
        if(!mongoose.Types.ObjectId.isValid(teamId)){ throw new Error('Invalid team ID.') }

        const team = await Team.findByIdAndUpdate(teamId)
        if (!team) { throw new Error('No such team found.') }

        const { leaderId } = team;
        if (!leaderId) { throw new Error('No leader assigned for this team.') }

        const updatedTeam = await Team.findByIdAndUpdate( _id = teamId, {$unset: {leader: ""}}, {new: true} );
        if (!updatedTeam) { throw new Error('There was a problem updating the team.') }

        const updatedProfile = await Profile.findByIdAndUpdate(_id = leaderId, { $pull: { teams: teamId } }, { new: true } );
        if (!updatedProfile) { throw new Error('There was a problem updating the leaders profile.') }
    
        res.status(200).json({team: updatedTeam, profile: updatedProfile});

    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

const addMembersToTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        if(!teamId){ throw new Error('No team ID provided.') }
        if(!mongoose.Types.ObjectId.isValid(teamId)){ throw new Error('Invalid team ID.') }

        const { members } = req.body;
        if(members.length === 0){ throw new Error('No members provided.') }
    
        const badMemberIds = [];
        const goodMemberIds = [];

        for (const memberId of members) {
            if (!mongoose.Types.ObjectId.isValid(memberId)) {
                badMemberIds.push({ memberId, reason: 'Invalid ID' });
                continue;
            }
            goodMemberIds.push(memberId);
        }
    
        if (goodMemberIds.length === 0) { throw new Error('No valid profile IDs provided.', badMemberIds); }

        const team = await Team.findById(teamId);
        if (!team) { throw new Error('No such team found.') }

        const nonLeaderMemberIds = [];
        goodMemberIds.forEach(id => {
            if (id.toString() === team.leader.toString()) {
                badMemberIds.push({ memberId: id, reason: 'Member is the team leader' });
            } else {
                nonLeaderMemberIds.push(id);
            }
        });

        team.members.push(...nonLeaderMembers).save();

        const updates = nonLeaderMembers.map(memberId =>
            Profile.findByIdAndUpdate( _id = memberId, { $addToSet: { teams: teamId } }, { new: true } )
        );

        await Promise.all(updates);

        res.status(200).json({ updatedTeam, rejectedMembers });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);        
    }
};

const removeMembersFromTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        if(!teamId){ throw new Error('No team ID provided.') }
        if(!mongoose.Types.ObjectId.isValid(teamId)){ throw new Error('Invalid team ID.') }

        const { members } = req.body;
        if(members.length === 0){ throw new Error('No members provided.') }
    
        const badMemberIds = [];
        const goodMemberIds = [];
        for (const memberId of members) {
            if (!mongoose.Types.ObjectId.isValid(memberId)) {
                badMemberIds.push({ memberId, reason: 'Invalid ID' });
                continue;
            }
            goodMemberIds.push(memberId);
        }
    
        if (goodMemberIds.length === 0) {throw new Error('No valid profile IDs provided.', badMemberIds); }

        const team = await Team.findById(teamId);
        if (!team) { throw new Error('No such team found.') }

        const nonLeaderMemberIds = [];
        goodMemberIds.forEach(id => {
            if (id.toString() === team.leader.toString()) {
                badMemberIds.push({ memberId: id, reason: 'Member is the team leader' });
            } else {
                nonLeaderMemberIds.push(id);
            }
        });

        const updatedTeam = await Team.findByIdAndUpdate( teamId, { $pull: { members: { $in: nonLeaderMemberIds } } }, { new: true } );
        if (!updatedTeam) { throw new Error('There was a problem updating the team.') }
    
        const updates = nonLeaderMemberIds.map(memberId =>
            Profile.findByIdAndUpdate( memberId, { $pull: { teams: id } }, { new: true } )
        );
        await Promise.all(updates);

        res.status(200).json({ updatedTeam, rejectedMembers });

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
    deleteTeamById,
    addLeaderById,
    removeLeaderById,
    addMembersToTeam,
    removeMembersFromTeam
}