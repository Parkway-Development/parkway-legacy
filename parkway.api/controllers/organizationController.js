const mongoose = require('mongoose')
const Organization = require('../models/organizationModel')
const appError = require('../applicationErrors')
const ValidationHelper = require('../helpers/validationHelper')
const { createAccountNumber } = require('../helpers/sharedHelpers')

const createOrganization = async (req, res, next) => {
    try {
        const { name, address, phone, email, website, primaryContactId, appSettings, subscription } = req.body
        if (!name) { throw new appError.MissingRequiredParameter('addOrganization', 'No name was provided. You must provide a name for the organization.') }
        if (!primaryContactId) { throw new appError.MissingRequiredParameter('addOrganization', 'No primary contact was provided. You must provide a primary contact for the organization.') }
        if (!mongoose.Types.ObjectId.isValid(primaryContactId)) { throw new appError.InvalidId('addOrganization') }
        if (!ValidationHelper.validateProfileId(primaryContactId)) { throw new appError.ProfileDoesNotExist('addOrganization') }
        if (!phone){ throw new appError.MissingRequiredParameter('addOrganization', 'No phone number was provided. You must provide a phone number for the organization.') }

        let organization = new Organization({
            name,
            accountNumber: createAccountNumber(phone),
            address,
            phone,
            email,
            website,
            primaryContactId,
            appSettings,
            subscription
        })

        await organization.save({ new: true });

        return res.status(201).json(organization)
    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const getAllOrganizations = async (req, res, next) => {
    try {
        const organizations = await Organization.find({})
        if (organizations.length === 0) { return res.status(204).json({ message: 'No organizations found.' }) }

        return res.status(200).json(organizations)
    } catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const getOrganizationById = async (req, res, next) => {
    try {
        const {id} = req.params.id
        if(!id) { throw new appError.MissingId('getOrganizationById') }
        if (!mongoose.Types.ObjectId.isValid(id)) { throw new appError.InvalidId('getOrganizationById') }

        const organization = await Organization.findById(_id = id)
        if (!organization) { return res.status(204).json({ message: 'No such organization found.' })}

        return res.status(200).json(organization)
    }
    catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const getOrganizationByName = async (req, res, next) => {
    try {
        const organizationName = req.params.name
        if (!organizationName) { throw new appError.MissingRequiredParameter('getOrganizationByName', 'No name was provided. You must provide a name for the organization.')}

        const organization = await Organization.findOne(organizationName)
        if (!organization) { return res.status(204).json({ message: `No such organization found with the name ${organizationName}.` })}

        return res.status(200).json(organization)
    }
    catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const getOrganizationByAccountNumber = async (req, res, next) => {
    try {
        const accountNumber = req.params.accountNumber
        if (!accountNumber) { throw new appError.MissingRequiredParameter('getOrganizationByAccountNumber', 'No account number was provided. You must provide an account number.')}

        const organization = await Organization.findOne(accountNumber)
        if (!organization) { return res.status(204).json({ message: `No such organization found with the account number ${accountNumber}.` })}

        return res.status(200).json(organization)
    }
    catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const getOrganizationByPhone = async (req, res, next) => {
    try {
        const phone = req.params.phone
        if (!phone) { throw new appError.MissingRequiredParameter('getOrganizationByBusinessPhone', 'No business phone number was provided. You must provide a business phone number.')}

        const organization = await Organization.findOne(phone)
        if (!organization) { return res.status(204).json({ message: `No such organization found with the phone number ${phone}.` } )}

        return res.status(200).json(organization)
    }
    catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const getOrganizationByEmail = async (req, res, next) => {
    try {
        const email = req.params.email
        if (!email) { throw new appError.MissingRequiredParameter('getOrganizationByBusinessEmail', 'No business email was provided. You must provide a business email.' )}

        const organization = await Organization.findOne({ email })
        if (!organization) { return res.status(204).json({ message: `No such organization found with the email ${email}.` })}
        return res.status(200).json(organization)
    }
    catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const updateOrganization = async (req, res, next) => {
    try {
        const {id} = req.params.id
        if(!id) { throw new appError.MissingId('updateOrganization')}
        if (!mongoose.Types.ObjectId.isValid(_id)) { throw new appError.InvalidId('updateOrganization')}

        const { name, address, phone, email, website, primaryContactId } = req.body

        const organization = await Organization.findByIdAndUpdate( _id= id ,
            name, address, phone, email, website, primaryContactId,{ new: true }
        );

        if (!organization) { throw new appError.UpdateFailed('updateOrganization')}

        return res.status(200).json(organization)
    }
    catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const updateAppSettings = async (req, res, next) => {
    try {
        const {id} = req.params.id
        const name = req.body.name.toloLowerCase();
        const value = req.body.value;
        if(!id) { throw new appError.MissingId('updateAppSettings')}
        if (!mongoose.Types.ObjectId.isValid(_id)) { throw new appError.InvalidId('updateAppSettings')}
        if (!name || !value) { throw new appError.MissingRequiredParameter('updateAppSettings')}

        const organization = await Organization.findByIdAndUpdate( _id= id ,
            name, value, { new: true }
        );

        if (!organization) { throw new appError.UpdateFailed('updateAppSettings')}

        return res.status(200).json(organization)
    }
    catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

const deleteOrganization = async (req, res, next) => {
    try {
        const {id} = req.params.id
        if (!id) { throw new appError.MissingId('deleteOrganization')}
        if (!mongoose.Types.ObjectId.isValid(_id)) { throw new appError.InvalidId('deleteOrganization')}
    
        const organization = await Organization.findByIdAndDelete(_id = id)
        if (!organization) { throw new appError.DeleteFailed('deleteOrganization')}

        return res.status(200).json({ message: "Organization deleted successfully." })
    }
    catch (error) {
        next(error)
        console.log({method: error.method, message: error.message});
    }
}

module.exports = { 
    createOrganization,
    getAllOrganizations,
    getOrganizationById,
    getOrganizationByName,
    getOrganizationByAccountNumber,
    getOrganizationByPhone,
    getOrganizationByEmail,
    updateOrganization,
    deleteOrganization,
    updateAppSettings
}
