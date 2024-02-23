const Person = require('../models/personModel')

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
        res.status(404).json({mssg: "The save failed."})}

        res.status(200).json(personToSave)
    }   
    catch (error) {
        res.status(500).json({message: error.message})
    }
}

//Get all persons
const getAll = async (req, res) => {
    try{
        const persons = await Person.find({}).sort({lastname: 1, firstname: 1});
        if(!persons){
            res.status(404).json({mssg: "No people were returned."})
        }
        res.status(200).json(persons)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
}

//Get person by ID
const getById = async (req, res) => {
    try{
        const { id } = req.params;
        const person = await Person.findById(id);

        if(!person){
            res.status(404).json({mssg: "No such person found."})
        }
        
        res.status(200).json(person)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
}

//Get person by last name
const getByLastName = async (req, res) => {
    try{
        const persons = await Person.find({lastname: req.params.lastname});
        if(!persons){
            res.status(404).json({mssg: "No people were returned."})
        }
        res.status(200).json(persons)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
}

//Get person by mobile number
const getByMobile = async (req, res) => {
    try{
        const persons = await Person.find({mobile: req.params.mobile});
        if(!persons){
            res.status(404).json({mssg: "No people were returned."})
        }
        res.status(200).json(persons)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
}

//Update person by ID
const updatePerson = async (req, res) => {
    try{
        const id = req.params.id;
        const updatedPerson = req.body;
        const options = {new: true};

        const result = await Person.findByIdAndUpdate(
            id, updatedPerson, options
        )
        if(!result){
            res.status(404).json({mssg: "There was a problem updating the user."})
        }

        res.status(200).json(result)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
}

//Delete person by ID
const deletePerson = async (req, res) => {
    try{
        const id = req.params.id;
        const person = await Person.findByIdAndDelete(id);
        res.send(`${person.firstname + " " + person.lastname} has been deleted.`)
    }
    catch(error){
        res.status(400).json({message: error.message})
    }
}

module.exports = { 
    addPerson, 
    getAll, 
    getById, 
    getByLastName, 
    getByMobile, 
    updatePerson, 
    deletePerson }