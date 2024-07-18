require('dotenv').config();

console.log('Environment variables loaded successfully.');

const PORT = process.env.PORT || 3000;
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const conn = mongoose.connection;
const Multer = require('multer');
const upload = Multer({ dest: 'uploads/' });
const { validateAppAndKey } = require('./middleware/validateAppAndKey');
const errorHandler = require('./middleware/errorHandler');

const userRoutes = require('./routes/users');
const profileRoutes = require('./routes/profiles');
const settingRoutes = require('./routes/settings');
const teamRoutes = require('./routes/teams');
const platformRoutes = require('./routes/platform');
const songRoutes = require('./routes/songs');
const eventRoutes = require('./routes/events');
const eventCategoryRoutes = require('./routes/eventCategories');
const uploadRoutes = require('./routes/uploads');
const healthRoutes = require('./routes/health');
const developerRoutes = require('./routes/developer');
const applicationClaimsRoutes = require('./routes/applicationClaims');
const organizationRoutes = require('./routes/organizations');
const attendanceRoutes = require('./routes/attedances');

const donationRoutes = require('./routes/accounting/donations');
const accountRoutes = require('./routes/accounting/accounts');
const contributionRoutes = require('./routes/accounting/contributions');
const depositRoutes = require('./routes/accounting/deposits');
const ledgerRoutes = require('./routes/accounting/ledger');

//express app
const app = express();

if (process.env.ALLOWED_ORIGINS) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

    const corsOptions = {
        origin: (origin, callback) => {
            if (allowedOrigins.includes(origin) || !origin) {
                callback(null, true);
            } else {
                callback(new Error(`Not allowed by CORS for origin [${origin}]`));
            }
        },
    };

    app.use(cors(corsOptions));
}

app.use((req, res, next) => {
    console.log(`Path: ${req.path}, Method: ${req.method}`);
    if (req.params && Object.keys(req.params).length > 0) { console.log(`Params: ${JSON.stringify(req.params)}`); }
    if (req.query && Object.keys(req.query).length > 0) { console.log(`Query: ${JSON.stringify(req.query)}`); }
    if (req.body && Object.keys(req.body).length > 0) { console.log(`Body: ${JSON.stringify(req.body)}`); }
    next();
});

app.use(validateAppAndKey);
app.use(express.json());

app.use('/test', (req, res) => {
    console.log('Test endpoint hit');
    console.log (req.body);
    return res.status(200).json({ message: 'Test successful', body: req.body});
});

//Routes
app.get ('/', (req, res) => { res.send('Welcome to the Parkway API'); });
app.use('/users', userRoutes);
app.use('/profiles', profileRoutes);
app.use('/settings', settingRoutes);
app.use('/teams', teamRoutes);
app.use('/platform', platformRoutes);
app.use('/songs', songRoutes);
app.use('/events', eventRoutes);
app.use('/eventCategories', eventCategoryRoutes);
app.use('/uploads', uploadRoutes);
app.use('/health', healthRoutes);
app.use('/developer', developerRoutes);
app.use('/applicationclaims', applicationClaimsRoutes);
app.use('/organizations', organizationRoutes);
app.use('/attendance', attendanceRoutes);

//Accounting routes
app.use('/accounting/donations', donationRoutes);
app.use('/accounting/accounts', accountRoutes);
app.use('/accounting/contributions', contributionRoutes);
app.use('/accounting/deposits', depositRoutes);
app.use('/accounting/ledger', ledgerRoutes);

// Catch-all route for undefined paths
//TODO: Add logging.....lots and lots of logging
app.use('*', (req, res) => {
    console.log(`Path: ${req.path}, Method: ${req.method}`)
    if(req.params) { console.log(`Params: ${req.params}`) }
    if(req.query) { console.log(`Query: ${req.query}`) }
    if(req.body) { console.log(`Body: ${req.body}`) }

    return res.status(404).json({ message: 'Endpoint not found' });
});

//Middleware
app.use(errorHandler)

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