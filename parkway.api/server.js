require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL
const userRoutes = require('./routes/user');
const peopleRoutes = require('./routes/people');

//express app
const app = express();

//Middleware
app.use((req, res, next)  => {
    console.log(req.path, req.method)
    next();
}) 

//Routes
app.use('/api/user', userRoutes);
app.use('/api/people', peopleRoutes);

//Database connection
mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        console.log('Database connected.')
        app.listen(process.env.PORT, () => {
            console.log('Listening for requests on port', process.env.PORT)
        })
    })
    .catch((err) => {
        console.log(err)
    })