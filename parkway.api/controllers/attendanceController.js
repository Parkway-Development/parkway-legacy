const mongoose = require('mongoose');
const Attendance = require('../models/attendanceModel');
const appError = require("../applicationErrors");
const AppError = require("../applicationErrors");
const ValidationHelper = require("../helpers/validationHelper");

const addAttendanceEntry = async (req, res, next) => {
    try {
        const {id} = req.params;
        if(!id) { throw new appError.MissingId('addAttendanceEntry') }
        if(!mongoose.Types.ObjectId.isValid(id)) { throw new appError.InvalidId('addAttendanceEntry') }

        const attendance = await Attendance.findById(id);

        if (!attendance) { throw new Error("No attendance was found with that Id.") }

        const attendanceEntry = new AttendanceEntry({
            ...req.body,
            attendance
        });

        if (!attendanceEntry) { throw new Error("Attendance entry could not be created.") }

        const validationError = attendanceEntry.validateSync();

        if (validationError) { throw new Error(validationError.message) }

        await attendanceEntry.save();
        return res.status(201).json(attendanceEntry);
    } catch (error) {
        next(error);
        console.log({ method: error.method, message: error.message });
    }
};

const getAttendanceEntries = async (req, res, next) => {
    try {
        const {id} = req.params;
        if(!id) { throw new appError.MissingId('getAttendanceEntries') }
        if(!mongoose.Types.ObjectId.isValid(id)) { throw new appError.InvalidId('getAttendanceEntries') }

        const entries = await AttendanceEntry.find({ attendance: id }).sort({ date: 'desc' });

        return res.status(201).json(entries ?? []);
    } catch (error) {
        next(error);
        console.log({ method: error.method, message: error.message });
    }
};

const getAttendanceEntriesByDateRange = async (req, res, next) => {
    try {
        const { startDate, endDate, populate } = req.query;
        if(!startDate || !endDate){ throw new AppError.MissingDateRange('getAttendanceEntriesByDateRange')}
        if(!ValidationHelper.checkDateOrder(startDate, endDate)){ throw new AppError.InvalidDateRange('getAttendanceEntriesByDateRange')}

        let entries;
        if(populate){
            entries = await AttendanceEntry.find({
                date: {
                    $gte: new Date(startDate).toISOString(),
                    $lte: new Date(endDate).toISOString()
                }
            }).sort({ date: 1})
                .populate('attendance');
        } else{
            entries = await AttendanceEntry.find({
                date: {
                    $gte: new Date(startDate).toISOString(),
                    $lte: new Date(endDate).toISOString()
                }
            }).sort({ date: 1});
        }

        if(entries.length === 0){ return res.status(204).json('No entries found for that date range.')}

        return res.status(200).json(entries);
    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const deleteAttendanceEntry = async (req, res, next) => {
    try {
        const {id} = req.params;
        if(!id) { throw new appError.MissingId('deleteAttendanceEntry') }
        if(!mongoose.Types.ObjectId.isValid(id)) { throw new appError.InvalidId('deleteAttendanceEntry') }

        const entry = await AttendanceEntry.findByIdAndDelete(id);

        if (!entry) { throw new Error("Attendance entry could not be created.") }

        return res.status(201).json(entry);
    } catch (error) {
        next(error);
        console.log({ method: error.method, message: error.message });
    }
};

const updateAttendanceEntry = async (req, res, next) => {
    try {
        const { id, attendanceId } = req.params;
        if(!id) { throw new appError.MissingId('updateAttendanceEntry') }
        if(!attendanceId) { throw new appError.MissingRequiredParameter('updateAttendanceEntry', 'Attendance is required') }
        if(!mongoose.Types.ObjectId.isValid(id)) { throw new appError.InvalidId('updateAttendanceEntry') }

        const update = {
            ...req.body,
            attendance: attendanceId
        };

        const updatedAttendance = await AttendanceEntry.findByIdAndUpdate(id, update, {new: true});

        if (!updatedAttendance) { throw new Error("Attendance entry could not be found to update.") }

        return res.status(201).json(updatedAttendance);
    } catch (error) {
        next(error);
        console.log({ method: error.method, message: error.message });
    }
};

module.exports = {
    getAttendanceEntriesByDateRange,
    addAttendanceEntry,
    getAttendanceEntries,
    deleteAttendanceEntry,
    updateAttendanceEntry
};
