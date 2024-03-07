require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const Multer = require('multer');
const conn = mongoose.connection;

const userRoutes = require('./routes/users');
const profileRoutes = require('./routes/profiles');
const settingRoutes = require('./routes/settings');
const teamRoutes = require('./routes/teams');
const assetRoutes = require('./routes/assets');
const budgetRoutes = require('./routes/budgets');
const donationRoutes = require('./routes/donations');
const expenseRoutes = require('./routes/expenses');
const accountRoutes = require('./routes/accounts');
const liabilityRoutes = require('./routes/liabilities');
const payrollRoutes = require('./routes/payroll');
const pledgeRoutes = require('./routes/pledges');
const vendorRoutes = require('./routes/vendors');
//const clientRoutes = require('./routes/client');
const platformRoutes = require('./routes/platform');
const songRoutes = require('./routes/songs');

const { Profile } = require('./models/profileModel');

Grid.mongo = mongoose.mongo;
let gfs;

const upload = Multer({ dest: 'uploads/' });

//express app
const app = express();

//Middleware
app.use((req, res, next)  => {
    console.log(req.path, req.method)
    next();
}) 

app.use(express.json());

//Routes
app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/liabilities', liabilityRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/pledges', pledgeRoutes);
app.use('/api/vendors', vendorRoutes);
//app.use('/api/clients', clientRoutes);
app.use('/api/platform', platformRoutes);
app.use('/api/songs', songRoutes);

// Catch-all route for undefined paths
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Endpoint not found' });
});


//Database connection
mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        console.log('Database connected.')
        gfs = Grid(conn.db, mongoose.mongo);
        gfs.collection('uploads');
        app.listen(process.env.PORT, () => {
            console.log('Listening for requests on port', process.env.PORT)
        })
    })
    .catch((err) => {
        console.log(err)
    })