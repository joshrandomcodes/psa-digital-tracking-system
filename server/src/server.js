const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// MIDDLEWARE
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173'
}));
app.use(express.json());

const { authenticate, authorize } = require('./middleware/auth');

// CONTROLLERS
const authController = require('./controllers/authController');
const requestController = require('./controllers/requestController');
const lcroController = require('./controllers/lcroController');
const psaStaffController = require('./controllers/psaStaffController');

// Limit sa login/register para hindi ma-brute force
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20
});

// ROOT / HEALTH CHECK
app.get('/', (req, res) => {
    res.status(200).json({ status: 'online' });
});

// AUTH ROUTES (public)
app.post('/api/auth/citizen/register', authLimiter, authController.registerCitizen);
app.post('/api/auth/citizen/login', authLimiter, authController.loginCitizen);
app.post('/api/auth/staff/login', authLimiter, authController.loginStaff);

// DOCUMENT REQUEST ROUTES
app.post(
    '/api/requests',
    authenticate,
    authorize('citizen'),
    requestController.submitRequest
);

app.get(
    '/api/requests',
    authenticate,
    authorize('citizen', 'lcro', 'psa_staff', 'admin'),
    requestController.listRequests
);

// LCRO ROUTES
app.get(
    '/api/lcro/queue',
    authenticate,
    authorize('lcro'),
    lcroController.listValidationQueue
);

app.post(
    '/api/lcro/validate',
    authenticate,
    authorize('lcro'),
    lcroController.validateRecord
);

// PSA STAFF ROUTES
app.post(
    '/api/staff/decision',
    authenticate,
    authorize('psa_staff'),
    psaStaffController.makeDecision
);

// 404 HANDLER
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'API endpoint not found.',
        path: req.originalUrl
    });
});

// ERROR HANDLER (walang detalyeng ibinabalik sa client)
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error.'
    });
});

// START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`PSA Tracking System Backend running on port ${PORT}`);
    console.log(`Server URL: http://localhost:${PORT}`);
});