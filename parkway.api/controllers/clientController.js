const mongoose = require('mongoose')
const Client = require('../models/clientModel')

//Add a client
const addClient = async (req, res) => {
    const client = new Client(req.body)

    try {
        const newClient = await client.save()
        if (!newClient) {
            return res.status(400).json({ message: "The save failed." })
        }
        return res.status(201).json(client)
    } catch (error) {
        return res.status(400).json(error)
    }
}

//Get all clients
const getAllClients = async (req, res) => {
    try {
        const clients = await Client.find({})
        return res.status(200).json(clients)
    } catch (error) {
        return res.status(500).json(error)
    }
}

//Get client by id
const getClientById = async (req, res) => {
    const _id = req.params.id

    try {
        const client = await Client.findById(_id)
        if (!client) {
            return res.status(404).json({message: "No such client found."})
        }
        return res.status(200).json(client)
    }
    catch (error) {
        return res.status(500).json(error)
    }
}

//Get client by name
const getClientByName = async (req, res) => {
    const clientName = req.params.name

    try {
        const client = await Client.findOne({ clientName })
        if (!client) {
            return res.status(404).json({message: "No such client found."})
        }
        return res.status(200).json(client)
    }
    catch (error) {
        return res.status(500).json(error)
    }
}

//Get client by account number
const getClientByAccountNumber = async (req, res) => {
    const accountNumber = req.params.accountNumber

    try {
        const client = await Client.findOne({ accountNumber })
        if (!client) {
            return res.status(404).json({message: "No such client found."})
        }
        return res.status(200).json(client)
    }
    catch (error) {
        return res.status(500).json(error)
    }
}

//Get client by business phone
const getClientByBusinessPhone = async (req, res) => {
    const businessPhone = req.params.businessPhone

    try {
        const client = await Client.findOne({ businessPhone })
        if (!client) {
            return res.status(404).json({message: "No such client found."})
        }
        return res.status(200).json(client)
    }
    catch (error) {
        return res.status(500).json(error)
    }
}

//Get client by business email
const getClientByBusinessEmail = async (req, res) => {
    const businessEmail = req.params.businessEmail

    try {
        const client = await Client.findOne({ businessEmail })
        if (!client) {
            return res.status(404).json({message: "No such client found."})
        }
        return res.status(200).json(client)
    }
    catch (error) {
        return res.status(500).json(error)
    }
}

//Update client by id
const updateClient = async (req, res) => {
    try {
        const _id = req.params.id
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(404).json({ message: 'No such client.' })
        }

        const client = await Client.findByIdAndUpdate({ _id: _id} ,
            { ...req.body },
            { new: true }
        );

        if (client) {
            return res.status(200).json(client)
        } else {
            return res.status(404).json({ message: "There was a problem updating the client." })
        }
    }
    catch (error) {
        return res.status(500).json(error)
    }
}

//Delete client by id
const deleteClient = async (req, res) => {
    const _id = req.params.id

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).json({ message: 'No such client.' })
    }

    try {
        const client = await Client.findByIdAndDelete(_id)
        if (!client) {
            return res.status(404).json({ message: "No such client found." })
        }
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
