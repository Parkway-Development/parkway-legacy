const express = require('express');
const router = express.Router();
const Person = require('../models/person');
const Family = require('../models/family');

module.exports = router;

//Post a Person
router.post('/person', async (req, res) => {
    const person = new Person({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        middleinitial: req.body.middleinitial,
        dateofbirth: req.body.dateofbirth,
        gender: req.body,
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
})   

//Get all Persons
router.get('/persons', async (req, res) => {
    try{
        const persons = await Person.find();
        res.json(persons)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get Person by ID
router.get('/person/:id', async (req, res) => {
    try{
        const person = await Person.findById(req.params.id);
        res.json(person)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get persons by last name
router.get('/person/lastname/:lastname', async (req, res) => {
    try{
        const persons = await Person.find({lastname: req.params.lastname});
        res.json(persons)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get persons by status
router.get('/person/status/:status', async (req, res) => {
    try{
        const persons = await Person.find({status: req.params.status});
        res.json(persons)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
