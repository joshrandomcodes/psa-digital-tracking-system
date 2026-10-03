const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// CONTROLLERS
const requestController =
    require('./controllers/requestController');

const lcroController =
    require('./controllers/lcroController');

const psaStaffController =
    require('./controllers/psaStaffController');


// ROOT / HEALTH CHECK
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'online',
        message:
            'PSA Digital Tracking System Backend is running.',
        server: 'Node.js / Express',
        port: process.env.PORT || 5000
    });
});


// DOCUMENT REQUEST ROUTES
app.post(
    '/api/requests',
    requestController.submitRequest
);

app.get(
    '/api/requests',
    requestController.listRequests
);


// LCRO ROUTES
app.get(
    '/api/lcro/queue',
    lcroController.listValidationQueue
);

app.post(
    '/api/lcro/validate',
    lcroController.validateRecord
);


// PSA STAFF ROUTES
app.post(
    '/api/staff/decision',
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


// ERROR HANDLER
app.use((err, req, res, next) => {
    console.error('Server error:', err);

    res.status(500).json({
        status: 'error',
        message: 'Internal server error.',
        detail: err.message
    });
});

// START SERVER
const PORT =
    process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `PSA Tracking System Backend running on port ${PORT}`
    );

    console.log(
        `Server URL: http://localhost:${PORT}`
    );
});
