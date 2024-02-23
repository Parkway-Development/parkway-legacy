const Person = require('../models/personModel')
const mongoose = require('mongoose')

//Post a person
const addPerson = async (req, res) => {
    const person = new Person({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        middleinitial: req.body.middleinitial,
        dateofbirth: req.body.dateofbirth,
        gender: req.body.gender,
        email: req.body.email,
        mobile: req.body.mobile,
        streetaddress1: req.body.streetaddress1,
        streetaddress2: req.body.streetaddress2,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip
    })

    try {
        const personToSave = await person.save();

        if(!personToSave){
        return res.status(404).json({mssg: "The save failed."})}

        res.status(200).json(personToSave)
    }   
    catch (error) {
        res.status(500).json({message: error.message})
    }
}

//Get all persons
const getAll = async (req, res) => {
    const persons = await Person.find({}).sort({lastname: 1, firstname: 1});
    if(!persons){
        return res.status(404).json({mssg: "No people were returned."})
    }
    res.status(200).json(persons)
}

//Get person by ID
const getById = async (req, res) => {

    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such person.'})
    }
    const person = await Person.findById(id);

    if(!person){
        return res.status(404).json({mssg: "No such person found."})
    }
        
    res.status(200).json(person)
}

//Get person by last name
const getByLastName = async (req, res) => {
    const persons = await Person.find({lastname: req.params.lastname});
    if(!persons){
        return res.status(404).json({mssg: "No people were returned."})
    }
    res.status(200).json(persons)
}

//Get person by mobile number
const getByMobile = async (req, res) => {
    const persons = await Person.find({mobile: req.params.mobile});
    if(!persons){
        return res.status(404).json({mssg: "No people were returned."})
    }
    res.status(200).json(persons)
}

//Update person by ID
const updatePerson = async (req, res) => {
    const id = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such person.'})
    }

    const updatedPerson = req.body;
    const options = {new: true};

    const person = await Person.findOneAndUpdate({_id: id}, 
        {
            ...req.body
        }
    )
    if(!person){
        return res.status(404).json({mssg: "There was a problem updating the user."})
    }

    res.status(200).json(person)
}

//Delete person by ID
const deletePerson = async (req, res) => {
    const id = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such person.'})
    }

    const person = await Person.findOneAndDelete({_id: id});

    if(!person){
        return res.status(500).json({mssg: "Something went wrong with the deletion."})
    }

    res.status(200).json(`${person.firstname + " " + person.lastname} has been deleted.`)
}

module.exports = { 
    addPerson, 
    getAll, 
    getById, 
    getByLastName, 
    getByMobile, 
    updatePerson, 
    deletePerson }