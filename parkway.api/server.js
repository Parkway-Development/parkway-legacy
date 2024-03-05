require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const profileRoutes = require('./routes/profile');
const settingRoutes = require('./routes/setting');
const teamRoutes = require('./routes/team');
const assetRoutes = require('./routes/asset');
const budgetRoutes = require('./routes/budget');
const donationRoutes = require('./routes/donation');
const expenseRoutes = require('./routes/expense');
const fundRoutes = require('./routes/fund');
const liabilityRoutes = require('./routes/liability');
const payrollRoutes = require('./routes/payroll');
const pledgeRoutes = require('./routes/pledge');
const vendorRoutes = require('./routes/vendor');
//const clientRoutes = require('./routes/client');
const platformRoutes = require('./routes/platform');


const { Profile } = require('./models/profileModel');

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
app.use('/api/setting', settingRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/asset', assetRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/donation', donationRoutes);
app.use('/api/expense', expenseRoutes);
app.use('/api/fund', fundRoutes);
app.use('/api/liability', liabilityRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/pledge', pledgeRoutes);
app.use('/api/vendor', vendorRoutes);
//app.use('/api/client', clientRoutes);
app.use('/api/platform', platformRoutes);

// Catch-all route for undefined paths
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Endpoint not found' });
});


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