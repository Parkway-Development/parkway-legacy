const User = require('../models/userModel')
const Profile = require('../models/profileModel')
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
    return jwt.sign({_id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRATION})    
}

//login user
const loginUser = async (req, res) => {
    const {email, password} = req.body

    try {
        if(!email || !password) {
            throw Error('All fields are required.')
        }
    
        const activeUser = await User.findOne({email})
        const authenticate = await bcrypt.compare(password, activeUser.password)

        if(!authenticate) {
            throw Error('Invalid credentials.')
        }
    
        const token = createToken(activeUser._id)
        
        const profile = await Profile.findOne({email})
            .populate('family', 'permissions','preferences','teams');

        if(profile){
            return res.status(200).json({email: email, token: token, profile: profile});
        }

        return res.status(200).json({email: email, token: token, message: 'No profile found'});
    } catch (error) {
        return res.status(400).json({error: error.message})
    }
}

//signup user
const signupUser = async (req, res) => {
    const {email, password} = req.body
    try {
        if(!email || !password) {
            throw Error('All fields are required.')
        }
    
        if(!validator.isEmail(email)) {
            throw Error('Invalid email')
        }
    
        const exists = await User.findOne({email})
        if(exists) {
            throw Error('Email already exists')
        }
    
        const pLength = process.env.MINIMUM_PASSWORD_LENGTH;
        const pLowercase = process.env.MINIMUM_PASSWORD_LOWERCASE;
        const pUppercase = process.env.MINIMUM_PASSWORD_UPPERCASE;
        const pNumbers = process.env.MINIMUM_PASSWORD_NUMBERS;
        const pSymbols = process.env.MINIMUM_PASSWORD_SYMBOLS;
    
        if (!validator.isStrongPassword(password, { 
            minLength: parseInt(pLength, 10), 
            minLowercase: parseInt(pLowercase, 10), 
            minUppercase: parseInt(pUppercase, 10), 
            minNumbers: parseInt(pNumbers, 10), 
            minSymbols: parseInt(pSymbols, 10) 
        })) {
            throw Error('Password is not strong enough');
        }

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        const newUser = await User.create({email, password: hash});
        
        const token = createToken(newUser._id)

        //check to see if there is a matching profile
        const profile = await Profile.findOne({email})

        const response = {_id: newUser._id, email: email, token: token, profile: "No profile found."}

        if(profile){
            response.profile = profile
        }
        
        return res.status(profile ? 200 : 201).json(response);
    } catch (error) {
        return res.status(400).json({error: error.message})
    }
}

//Get all users
const getAll = async (req, res) => {
    try {
        const users = await User.find({});

        if(users.length === 0){
            return res.status(404).json({message: "No users found."});
        }
        const modifiedUsers = users.map(user => {
            const userObj = user.toObject(); 
            delete userObj.password;         
            return userObj;                  
        });
        return res.status(200).json(modifiedUsers);
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
};

//Get user by ID
const getById = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id)
    if(!user){
        return res.status(404).json({message: "No such user found."})
    }
    const userObj = user.toObject();
    delete userObj.password;
    return res.status(200).json(user)
}

//Get user by email
const getByEmail = async (req, res) => {
    const { email } = req.params;
    const user = await User.findOne({email})
    if(!user){
        return res.status(404).json({message: "No such user found."})
    }

    const userObj = user.toObject();
    delete userObj.password;
    return res.status(200).json(userObj)
}

module.exports = { 
    signupUser, 
    loginUser,
    getAll,
    getById,
    getByEmail
}