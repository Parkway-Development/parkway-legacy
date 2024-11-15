const Location = require('../models/locationModel');
const { buildAction } = require("../helpers/controllerHelper");

const addLocation = buildAction({
    requiredBodyProps: ['name'],
    handler: async (req, res) => {
        const locationEntry = new Location({
            ...req.body
        });

        if (!locationEntry) { throw new Error("Location could not be created.") }

        const validationError = locationEntry.validateSync();

        if (validationError) { throw new Error(validationError.message) }

        await locationEntry.save();
        return res.status(201).json(locationEntry);
    }
});

const getLocations = buildAction({
    handler: async (req, res) => {
        const locations = await Location.find({}).sort({ name: 'asc' });

        return res.status(200).json(locations ?? []);
    }
});

const getLocationById = buildAction({
    requiredParams: ['id'],
    validateIdParam: true,
    handler: async (req, res) => {
        const {id} = req.params;

        const location = await Location.findById(id);

        if (!location) { throw new Error("No location was found with that Id.") }

        return res.status(200).json(location ?? []);
    }
});

const deleteLocation = buildAction({
    validateIdParam: true,
    requiredParams: ['id'],
    handler: async (req, res) => {
       const {id} = req.params;

       // TODO: Should we check for instances using this location
       const entry = await Location.findByIdAndDelete(id);

       if (!entry) { throw new Error("Location could not be deleted.") }

       return res.status(201).json(entry);
   }
});

const updateLocation = buildAction({
    requiredBodyProps: ['name'],
    validateIdParam: true,
    requiredParams: ['id'],
    handler: async (req, res) => {
        const { id, } = req.params;

        const update = {
            ...req.body
        };

        const updatedLocation = await Location.findByIdAndUpdate(id, update, { new: true });

        if (!updatedLocation) { throw new Error("Location could not be found to update.") }

        return res.status(201).json(updatedLocation);
    }
});

module.exports = {
    addLocation,
    getLocations,
    getLocationById,
    deleteLocation,
    updateLocation
};
