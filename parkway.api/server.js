require('dotenv').config();
const PORT = process.env.PORT || 3000;
const express = require('express');
const mongoose = require('mongoose');
const conn = mongoose.connection;
const Multer = require('multer');
const upload = Multer({ dest: 'uploads/' });
const { validateAppAndKey } = require('./middleware/validateAppAndKey');

const userRoutes = require('./routes/users');
const profileRoutes = require('./routes/profiles');
const settingRoutes = require('./routes/settings');
const teamRoutes = require('./routes/teams');
const assetRoutes = require('./routes/accounting/assets');
const budgetRoutes = require('./routes/accounting/budgets');
const donationRoutes = require('./routes/accounting/donations');
const expenseRoutes = require('./routes/accounting/expenses');
const accountRoutes = require('./routes/accounting/accounts');
const liabilityRoutes = require('./routes/accounting/liabilities');
const payrollRoutes = require('./routes/accounting/payroll');
const pledgeRoutes = require('./routes/accounting/pledges');
const vendorRoutes = require('./routes/accounting/vendors');
const contributionRoutes = require('./routes/accounting/contributions');
const platformRoutes = require('./routes/platform');
const songRoutes = require('./routes/songs');
const eventRoutes = require('./routes/events');
const eventCategoryRoutes = require('./routes/eventCategories');
const uploadRoutes = require('./routes/uploads');
const healhRoutes = require('./routes/health');
const developerRoutes = require('./routes/developer');
const applicationClaimsRoutes = require('./routes/applicationClaims');

//express app
const app = express();

//Middleware
app.use((req, res, next)  => { console.log(req.path, req.method, req.body), next(); }) 
app.use(validateAppAndKey);
app.use(express.json());


//Routes
app.get ('/', (req, res) => { res.send('Welcome to the Parkway API'); });
app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/platform', platformRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/eventCategories', eventCategoryRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/health', healhRoutes);
app.use('/api/developer', developerRoutes);
app.use('/api/applicationclaims', applicationClaimsRoutes);

//Accounting routes
app.use('/api/accounting/assets', assetRoutes);
app.use('/api/accounting/budgets', budgetRoutes);
app.use('/api/accounting/donations', donationRoutes);
app.use('/api/accounting/expenses', expenseRoutes);
app.use('/api/accounting/accounts', accountRoutes);
app.use('/api/accounting/liabilities', liabilityRoutes);
app.use('/api/accounting/payroll', payrollRoutes);
app.use('/api/accounting/pledges', pledgeRoutes);
app.use('/api/accounting/vendors', vendorRoutes);
app.use('/api/accounting/contributions', contributionRoutes);

// Catch-all route for undefined paths
//TODO: Add logging.....lots and lots of logging
app.use('*', (req, res) => {
    console.log(`Path: ${req.path}, Method: ${req.method}, Params: ${req.params}, Query: ${req.query}, Body: ${req.body}`)

    if(req.method === 'PATCH' && !req.params.id) { return res.status(400).json({ error: 'Required parameters were not sent.' } ) }
    return res.status(404).json({ message: 'Endpoint not found' });
});


//Database connection
mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        console.log('Database connected.')
        app.listen(PORT, () => {
            console.log(`Listening for requests on port ${PORT}`)
        })
    })
    .catch((err) => {
        console.log(err)
    })