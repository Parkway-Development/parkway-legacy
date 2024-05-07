const mongoose = require('mongoose')
const Client = require('../models/clientModel')

const addClient = async (req, res) => {
    try {
        const client = new Client(req.body)
        if (!client) { throw new Error("Please provide a client.")}

        const newClient = await client.save()
        if (!newClient) { throw new Error("The save failed.")}

        return res.status(201).json(client)
    } catch (error) {
        return res.status(400).json(error)
    }
}

const getAllClients = async (req, res) => {
    try {
        const clients = await Client.find({})
        if (clients.length === 0) { throw new Error("No clients found.")}

        return res.status(200).json(clients)
    } catch (error) {
        return res.status(500).json(error)
    }
}

const getClientById = async (req, res) => {
    try {
        const {id} = req.params.id
        if(!id) { throw new Error("Please provide an id.")}
        if (!mongoose.Types.ObjectId.isValid(id)) { throw new Error("Invalid ID.")}

        const client = await Client.findById(_id = id)
        if (!client) { throw new Error("No such client found.")}

        return res.status(200).json(client)
    }
    catch (error) {
        return res.status(500).json(error)
    }
}

const getClientByName = async (req, res) => {
    try {
        const clientName = req.params.name
        if (!clientName) { throw new Error("Please provide a client name.")}

        const client = await Client.findOne(clientName)
        if (!client) { throw new Error("No such client found.")}

        return res.status(200).json(client)
    }
    catch (error) {
        return res.status(500).json(error)
    }
}

const getClientByAccountNumber = async (req, res) => {
    try {
        const accountNumber = req.params.accountNumber
        if (!accountNumber) { throw new Error("Please provide an account number.")}

        const client = await Client.findOne(accountNumber)
        if (!client) { throw new Error("No such client found.")}

        return res.status(200).json(client)
    }
    catch (error) {
        return res.status(500).json(error)
    }
}

const getClientByBusinessPhone = async (req, res) => {
    try {
        const businessPhone = req.params.businessPhone
        if (!businessPhone) { throw new Error("Please provide a business phone.")}

        const client = await Client.findOne(businessPhone)
        if (!client) { throw new Error("No such client found.")}

        return res.status(200).json(client)
    }
    catch (error) {
        return res.status(500).json(error)
    }
}

const getClientByBusinessEmail = async (req, res) => {
    try {
        const businessEmail = req.params.businessEmail
        if (!businessEmail) { throw new Error("Please provide a business email.")}

        const client = await Client.findOne({ businessEmail })
        if (!client) { throw new Error("No such client found.")}
        return res.status(200).json(client)
    }
    catch (error) {
        return res.status(500).json(error)
    }
}

const updateClient = async (req, res) => {
    try {
        const {id} = req.params.id
        if(!id) { throw new Error("Please provide an ID.")}
        if (!mongoose.Types.ObjectId.isValid(_id)) { throw new Error("Invalid ID.")}

        const client = await Client.findByIdAndUpdate( _id= id ,
            { ...req.body },
            { new: true }
        );

        if (!client) { throw new Error("No such client found.")}

        return res.status(200).json(client)
    }
    catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

//Delete client by id
const deleteClient = async (req, res) => {
    try {
        const {id} = req.params.id
        if (!id) { throw new Error("Please provide an ID.")}
        if (!mongoose.Types.ObjectId.isValid(_id)) { throw new Error("Invalid ID.")}
    
        const client = await Client.findByIdAndDelete(_id = id)
        if (!client) { throw new Error("No such client found.")}

        return res.status(200).json({ message: "Client deleted successfully." })
    }
    catch (error) {
        return res.status(500).json(error)
    }
}

module.exports = { 
    addClient,
    getAllClients,
    getClientById,
    getClientByName,
    getClientByAccountNumber,
    getClientByBusinessPhone,
    getClientByBusinessEmail,
    updateClient,
    deleteClient
}
