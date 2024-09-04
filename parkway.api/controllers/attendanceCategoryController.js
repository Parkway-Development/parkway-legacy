const mongoose = require('mongoose');
const AttendanceCategory = require('../models/attendanceCategoryModel');
const appError = require("../applicationErrors");

const addAttendanceCategory = async (req, res, next) => {
    try {
        const category = new AttendanceCategory(req.body);
        if (!category) { throw new Error("Attendance category could not be created.") }

        const validationError = category.validateSync();

        if (validationError) { throw new Error(validationError.message) }

        await category.save();
        return res.status(201).json(category);
    } catch (error) {
        next(error);
        console.log({ method: error.method, message: error.message });
    }
};

const getAllAttendanceCategories = async (req, res, next) => {
    try{
        const attendances = await AttendanceCategory.find({}).sort({name: 'asc'});

        if (!attendances) { throw new Error("No attendance categories were returned.") }

        res.status(200).json(attendances);
    } catch (error) {
        next(error);
        console.log({ method: error.method, message: error.message });
    }
}

const getAttendanceCategoryById = async (req, res, next) => {
    try {
        const {id} = req.params;
        if(!id) { throw new appError.MissingId('getAttendanceCategoryById') }
        if(!mongoose.Types.ObjectId.isValid(id)) { throw new appError.InvalidId('getAttendanceCategoryById') }

        const category = await AttendanceCategory.findById(id);

        if (!category) { throw new Error("No attendance category was found with that Id.") }

        res.status(200).json(category);
    } catch (error) {
        next(error);
        console.log({ method: error.method, message: error.message });
    }
}

const updateAttendanceCategory = async (req, res, next) => {
    try {
        const {id} = req.params;
        if(!id) { throw new appError.MissingId('updateAttendanceCategory') }
        if(!mongoose.Types.ObjectId.isValid(id)) { throw new appError.InvalidId('updateAttendanceCategory') }

        const updatedAttendance = await AttendanceCategory.findByIdAndUpdate(id, req.body, {new: true});

        if (!updatedAttendance) {
            return res.status(404).json({message: "No such attendance category found."})
        }
        res.status(200).json(updatedAttendance)
    } catch (error) {
        next(error);
        console.log({ method: error.method, message: error.message });
    }
}

const deleteAttendanceCategory = async (req, res, next) => {
    try {
        const {id} = req.params;
        if(!id) { throw new appError.MissingId('deleteAttendanceCategory') }
        if(!mongoose.Types.ObjectId.isValid(id)) { throw new appError.InvalidId('deleteAttendanceCategory') }

        const deletedCategory = await AttendanceCategory.findByIdAndDelete(id);

        if (!deletedCategory) { throw new Error("No attendance category was found with that Id.") }

        res.status(200).json(deletedCategory);
    } catch (error) {
        next(error);
        console.log({ method: error.method, message: error.message });
    }
}

module.exports = {
    addAttendanceCategory,
    getAllAttendanceCategories,
    getAttendanceCategoryById,
    updateAttendanceCategory,
    deleteAttendanceCategory
};
