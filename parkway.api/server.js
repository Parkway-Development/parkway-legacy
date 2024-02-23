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
}), 

//Routes
app.use('/api/user', userRoutes);
app.use('/api/people', peopleRoutes);

//listen for requests
app.listen(process.env.PORT, () => {
    console.log('listening on port ', process.env.PORT);
})

//Database connection
mongoose.connect(mongoString);
const database = mongoose.connection

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})