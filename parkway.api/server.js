require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const profileRoutes = require('./routes/profile');
const teamRoutes = require('./routes/team');

//express app
const app = express();

//Middleware
app.use((req, res, next)  => {
    console.log(req.path, req.method)
    next();
}) 

app.use(express.json());

//Routes
app.use('/api/user', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/team', teamRoutes);

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