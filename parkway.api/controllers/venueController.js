const mongoose = require('mongoose');
const Venue = require('../models/venueModel');
const Profile = require('../models/profileModel');
const Address = require('../models/sharedModels').Address;
const AppError = require('../../applicationErrors')

const addVenue = async (req, res, next) => {
    try {
        const { name, address, status } = req.body;
        if (!name || !address) { throw new AppError.MissingRequiredParameter('addVenue'); }
    
        const venue = new Venue({
            name,
            address,
            status: status || null
        }).save( (err, venue) => {
            if (err) { throw new AppError.DatabaseError('addVenue', err); }
            res.status(200).json(venue);
        });            

        res.status(200).json(venue);
    } catch (error) {
        next(error);
        console.log({method: error.method, message: error.message});
    }
}

const getAllVenues = async (req, res, next) => {
    try {
        const venues = await Venue.find({}).sort({name: 1});
        if(venues.length === 0) { return res.status(204).json({venues: venues, message: 'No venues were returned.'})}

        res.status(200).json(venues)
    
    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const getVenueById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if(!id){ throw new AppError.MissingRequiredParameter('getVenueById','No Id provided.')}
        if(!mongoose.Types.ObjectId.isValid(id)){ throw new AppError.InvalidId('getVenueById')}

        const venue = await Venue.findById(id);
        if(!venue) { return res.status(204).json({message: 'No venue found for that Id.'})};
            
        res.status(200).json(team)
    
    } catch (error) {
        next(error)
        console.log(error);;
    }
}

const getVenueByName = async (req, res, next) => {
    try {
        const { name } = req.params;
        if(!name){ throw new AppError.MissingRequiredParameter('getVenueByName','No name provided.')}

        const venues = await Team.find({name: name});
        if(venues.length === 0) { return res.status(204).json({venues: venues, message: 'No venues were returned.'})}

        res.status(200).json(venues)
    
    } catch (error) {
        next(error)
        console.log(error);;
    }
}

const updateVenueById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if(!id){ throw new AppError.MissingRequiredParameter('updateVenueById','No ID provided.')}
        if(!mongoose.Types.ObjectId.isValid(id)){ throw new AppError.InvalidId('updateVenueById')}

        const venue = await Venue.findById(id);
        if (!venue) { throw new AppError.NotFound('updateVenueById'); }

        venue.name = req.body.name || venue.name;
        venue.address = req.body.address || venue.address;
        venue.status = req.body.status || venue.status;

        await venue.save();
        res.status(200).json(venue);
    } catch (error) {
        next(error)
        console.log(error);;
    }
}

const deleteVenueById = async (req, res) => {
    try {
        const { id } = req.params;
        if(!id){ throw new AppError.MissingRequiredParameter('deleteVenueById','No ID provided.')}
        if(!mongoose.Types.ObjectId.isValid(id)){ throw new AppError.InvalidId('deleteVenueById')}
    
        const deletedVenue = await Venue.findByIdAndDelete(id);

        if(!deletedVenue){ throw new AppError.DeleteFailed('deleteVenueById') }

        res.status(200).json(deletedTeam);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}


module.exports = {
    addVenue,
    getAllVenues,
    getVenueById,
    getVenueByName,
    updateVenueById,
    deleteVenueById
}