const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'psa_database',
    ssl: { ca: fs.readFileSync(path.join(__dirname, 'ca.pem')) },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;