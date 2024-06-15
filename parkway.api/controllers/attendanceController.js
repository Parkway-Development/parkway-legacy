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
}

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
    deleteAttendance
};
