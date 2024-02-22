const express = require('express');
const router = express.Router();
const Person = require('../models/person');
const Family = require('../models/family');

module.exports = router;

//Post a Person
router.post('/people', async (req, res) => {
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
        // member: req.body.member,
        // status: req.body.status,
        // applicationroles: req.body.applicationroles,
        // organizationalroles: req.body.organizationalroles,
        // teams: req.body.teams,
        // functions: req.body.functions,
        // family: req.body.family
    })

    try {
        console.log(person);
        const personToSave = await person.save();
        res.status(200).json(personToSave)
    }   
    catch (error) {
        res.status(400).json({message: error.message})
    }
})   

//Get all Persons
router.get('/people/getall', async (req, res) => {
    try{
        const persons = await Person.find();
        res.json(persons)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get Person by ID
router.get('/people/:id', async (req, res) => {
    try{
        const person = await Person.findById(req.params.id);
        res.json(person)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get persons by last name
router.get('/people/lastname/:lastname', async (req, res) => {
    try{
        const persons = await Person.find({lastname: req.params.lastname});
        res.json(persons)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get persons by mobile number
router.get('/people/mobile/:mobile', async (req, res) => {
    try{
        const persons = await Person.find({mobile: req.params.mobile});
        res.json(persons)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

router.patch('/people/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedPerson = req.body;
        const options = { new: true };

        const result = await Person.findByIdAndUpdate(
            id, updatedPerson, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Delete by ID Method
router.delete('/people/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const person = await Person.findByIdAndDelete(id)
        res.send(`${person.firstname + " " + person.lastname} has been deleted.`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})