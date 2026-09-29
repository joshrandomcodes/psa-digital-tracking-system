const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Import Controllers
const requestController = require('./controllers/requestController');
const lcroController = require('./controllers/lcroController');
const psaStaffController = require('./controllers/psaStaffController');

// Level 1 DFD Routes
app.post('/api/requests', requestController.submitRequest);
app.post('/api/lcro/validate', lcroController.validateRecord);
app.post('/api/staff/decision', psaStaffController.makeDecision);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`PSA Tracking System Backend running on port ${PORT}`);
});