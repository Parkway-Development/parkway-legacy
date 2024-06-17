const mongoose = require('mongoose');
const Attendance = require('../models/attendanceModel');
const AttendanceEntry = require('../models/attendanceEntryModel');
const appError = require("../applicationErrors");

const addAttendance = async (req, res, next) => {
    try {
        const attendance = new Attendance(req.body);
        if (!attendance) { throw new Error("Attendance could not be created.") }

        const validationError = attendance.validateSync();

        if (validationError) { throw new Error(validationError.message) }

        await attendance.save();
        return res.status(201).json(attendance);
    } catch (error) {
        next(error);
        console.log({ method: error.method, message: error.message });
    }
};

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

const getAllAttendances = async (req, res, next) => {
    try{
        const attendances = await Attendance.find({}).sort({name: 'asc'});

        if (!attendances) { throw new Error("No attendances were returned.") }
    
        res.status(200).json(attendances);
    } catch (error) {
        next(error);
        console.log({ method: error.method, message: error.message });
    }
}

const getAttendanceById = async (req, res, next) => {
    try {
        const {id} = req.params;
        if(!id) { throw new appError.MissingId('getAttendanceById') }
        if(!mongoose.Types.ObjectId.isValid(id)) { throw new appError.InvalidId('getAttendanceById') }

        const attendance = await Attendance.findById(id);
    
        if (!attendance) { throw new Error("No attendance was found with that Id.") }
    
        res.status(200).json(attendance);
    } catch (error) {
        next(error);
        console.log({ method: error.method, message: error.message });
    }
}

const updateAttendance = async (req, res, next) => {
    try {
        const {id} = req.params;
        if(!id) { throw new appError.MissingId('updateEventCategory') }
        if(!mongoose.Types.ObjectId.isValid(id)) { throw new appError.InvalidId('updateEventCategory') }

        const updatedAttendance = await Attendance.findByIdAndUpdate(id, req.body, {new: true});
    
        if (!updatedAttendance) {
            return res.status(404).json({message: "No such event category found."})
        }
        res.status(200).json(updatedAttendance)
    } catch (error) {
        next(error);
        console.log({ method: error.method, message: error.message });
    }
}

const deleteAttendance = async (req, res, next) => {
    try {
        const {id} = req.params;
        if(!id) { throw new appError.MissingId('deleteEventCategory') }
        if(!mongoose.Types.ObjectId.isValid(id)) { throw new appError.InvalidId('deleteEventCategory') }
    
        const deletedAttendance = await Attendance.findByIdAndDelete(id);
    
        if (!deletedAttendance) { throw new Error("No attendance was found with that Id.") }

        res.status(200).json(deletedAttendance);
    } catch (error) {
        next(error);
        console.log({ method: error.method, message: error.message });
    }
}

module.exports = {
    addAttendance,
    getAllAttendances,
    getAttendanceById,
    updateAttendance,
    deleteAttendance,
    addAttendanceEntry,
    getAttendanceEntries,
    deleteAttendanceEntry,
    updateAttendanceEntry
};
