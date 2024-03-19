const mongoose = require('mongoose');
const KidsWorldRegistration = require('../models/wixKidsWorldRegistrationModel')

// Register child for Kids World
const kwRegisterChild = async (req, res) => {
    const registration = new KidsWorldRegistration(req.body)

    try {
        const newRegistration = await registration.save()
        if (!newRegistration) {
            return res.status(400).json({ message: "The save failed." })
        }
        return res.status(201).json(registration)
    } catch (error) {
        return res.status(400).json(error)
    }
}

// Get all Kids World registrations
const kwGetAllRegistrations = async (req, res) => {
    try {
        const registrations = await KidsWorldRegistration.find({})
        return res.status(200).json(registrations)
    } catch (error) {
        return res.status(500).json(error)
    }
}

// Get Kids World registration by id
const kwGetRegistrationById = async (req, res) => {
    const _id = req.params.id

    try {
        const registration = await KidsWorldRegistration
            .findById(_id)
        if (!registration) {
            return res.status(404).json({message: "No such registration found."})
        }
        return res.status(200).json(registration)
    }
    catch (error) {
        return res.status(500).json(error)
    }
}

// Update Kids World registration by id
const kwUpdateRegistration = async (req, res) => {
    const _id = req.params.id

    try {
        const registration = await KidsWorldRegistration
            .findById
            (
                _id,
                req.body,
                { new: true }
            )
        if (!registration) {
            return res.status(404).json({message: "No such registration found."})
        }
        return res.status(200).json(registration)
    }
    catch (error) {
        return res.status(500).json(error)
    }
}

// Delete Kids World registration by id
const kwDeleteRegistration = async (req, res) => {
    const _id = req.params.id

    try {
        const registration = await KidsWorldRegistration
            .findByIdAndDelete(_id)
        if (!registration) {
            return res.status(404).json({message: "No such registration found."})
        }
        return res.status(200).json(registration)
    }
    catch (error) {
        return res.status(500).json(error)
    }
}

module.exports = {
    kwRegisterChild,
    kwGetAllRegistrations,
    kwGetRegistrationById,
    kwUpdateRegistration,
    kwDeleteRegistration
}