const mongoose = require('mongoose');
const Attendance = require('../models/attendanceModel');
const Event = require('../models/eventModel');
const appError = require("../applicationErrors");
const ValidationHelper = require("../helpers/validationHelper");
const { buildAction } = require("../helpers/controllerHelper");

const addAttendanceEntry = buildAction({
    requiredBodyProps: ['event', 'createdBy', 'total', 'date'],
    handler: async (req, res) => {
        const { event, createdBy, total, categories } = req.body;

        if (!mongoose.Types.ObjectId.isValid(event)) throw new appError.InvalidId('addAttendanceEntry', 'The event Id is not valid');
        if (!mongoose.Types.ObjectId.isValid(createdBy)) throw new appError.InvalidId('addAttendanceEntry', 'The created by profile Id is not valid');
        if (!ValidationHelper.validateProfileId(createdBy)) throw new appError.ProfileDoesNotExist('addAttendanceEntry', 'The created by profile does not exist');

        const eventModel = await Event.findById(event);

        if (!eventModel) { throw new Error("No event was found with that Id.") }

        if (categories && categories.length) {
            const categoriesTotal = categories.reduce((acc, category) => {
                const count = Number(category.count);
                if (Number.isSafeInteger(count)) return acc + count;
                return acc;
            }, 0);
            if (total !== categoriesTotal) { throw new Error("Category counts do not match the total"); }
        }

        const attendanceEntry = new Attendance({
            ...req.body
        });

        if (!attendanceEntry) { throw new Error("Attendance could not be created.") }

        const validationError = attendanceEntry.validateSync();

        if (validationError) { throw new Error(validationError.message) }

        await attendanceEntry.save();
        return res.status(201).json(attendanceEntry);
    }
});

const getAttendanceEntries = buildAction({
    handler: async (req, res) => {
        const entries = await Attendance.find({}).sort({ date: 'desc' }).populate('event');

        return res.status(200).json(entries ?? []);
    }
});

const getAttendanceEntryById = buildAction({
    requiredParams: ['id'],
    validateIdParam: true,
    handler: async (req, res) => {
        const {id} = req.params;

        const attendance = await Attendance.findById(id).populate('event');

        if (!attendance) { throw new Error("No attendance was found with that Id.") }

        return res.status(200).json(attendance ?? []);
    }
});

const getAttendanceEntriesByDateRange = buildAction({
   handler: async (req, res) => {
       const { startDate, endDate } = req.query;
       if(!startDate || !endDate){ throw new appError.MissingDateRange('getAttendanceEntriesByDateRange')}
       if(!ValidationHelper.checkDateOrder(startDate, endDate)){ throw new appError.InvalidDateRange('getAttendanceEntriesByDateRange')}

       const entries = await Attendance.find({
               date: {
                   $gte: new Date(startDate).toISOString(),
                   $lte: new Date(endDate).toISOString()
               }
           }).sort({ date: 1 }).populate('event');

       if(entries.length === 0) { return res.status(204).json('No entries found for that date range.'); }

       return res.status(200).json(entries);
   }
});

const deleteAttendanceEntry = buildAction({
    validateIdParam: true,
    requiredParams: ['id'],
    handler: async (req, res) => {
       const {id} = req.params;

       const entry = await Attendance.findByIdAndDelete(id);

       if (!entry) { throw new Error("Attendance could not be deleted.") }

       return res.status(201).json(entry);
   }
});

const updateAttendanceEntry = buildAction({
    requiredBodyProps: ['event', 'createdBy', 'total', 'date'],
    validateIdParam: true,
    requiredParams: ['id'],
    handler: async (req, res) => {
        const { id, } = req.params;
        const { total, categories } = req.body;

        if (categories && categories.length) {
            const categoriesTotal = categories.reduce((acc, category) => {
                const count = Number(category.count);
                if (Number.isSafeInteger(count)) return acc + count;
                return acc;
            }, 0);
            if (total !== categoriesTotal) { throw new Error("Category counts do not match the total"); }
        }

        const update = {
            ...req.body
        };

        const updatedAttendance = await Attendance.findByIdAndUpdate(id, update, { new: true });

        if (!updatedAttendance) { throw new Error("Attendance entry could not be found to update.") }

        return res.status(201).json(updatedAttendance);
    }
});

module.exports = {
    getAttendanceEntriesByDateRange,
    addAttendanceEntry,
    getAttendanceEntries,
    getAttendanceEntryById,
    deleteAttendanceEntry,
    updateAttendanceEntry
};
