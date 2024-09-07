const AttendanceCategory = require('../models/attendanceCategoryModel');
const { buildAction } = require("../helpers/controllerHelper");

const addAttendanceCategory = buildAction({
    handler: async (req, res) => {
        const category = new AttendanceCategory(req.body);
        if (!category) { throw new Error("Attendance category could not be created.") }

        const validationError = category.validateSync();

        if (validationError) { throw new Error(validationError.message) }

        await category.save();
        return res.status(201).json(category);
    }
});

const getAllAttendanceCategories = buildAction({
    handler: async (req, res) => {
        const attendances = await AttendanceCategory.find({}).sort({name: 'asc'});

        if (!attendances) { throw new Error("No attendance categories were returned.") }

        res.status(200).json(attendances);
    }
});

const getAttendanceCategoryById = buildAction({
    requiredParams: ['id'],
    validateIdParam: true,
    handler: async (req, res) => {
        const {id} = req.params;

        const category = await AttendanceCategory.findById(id);

        if (!category) { throw new Error("No attendance category was found with that Id.") }

        res.status(200).json(category);
    }
});

const updateAttendanceCategory = buildAction({
    requiredParams: ['id'],
    validateIdParam: true,
    handler: async (req, res) => {
        const {id} = req.params;

        const updatedAttendance = await AttendanceCategory.findByIdAndUpdate(id, req.body, {new: true});

        if (!updatedAttendance) {
            return res.status(404).json({message: "No such attendance category found."})
        }

        res.status(200).json(updatedAttendance);
    }
});

const deleteAttendanceCategory = buildAction({
    requiredParams: ['id'],
    validateIdParam: true,
    handler: async (req, res) => {
        const {id} = req.params;

        const deletedCategory = await AttendanceCategory.findByIdAndDelete(id);

        if (!deletedCategory) { throw new Error("No attendance category was found with that Id.") }

        res.status(200).json(deletedCategory);
    }
});

module.exports = {
    addAttendanceCategory,
    getAllAttendanceCategories,
    getAttendanceCategoryById,
    updateAttendanceCategory,
    deleteAttendanceCategory
};
