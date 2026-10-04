const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const philsysGateway = require('../integrations/philsysGateway');

// AYUSIN ayon sa seed.sql: ang tamang halaga ng PSA_STAFF.Role
const STAFF_ROLE_MAP = {
    'LCRO Officer': 'lcro',
    'PSA Staff': 'psa_staff',
    'Admin': 'admin'
};

function signToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '2h'
    });
}

// CITIZEN REGISTER (nagse-set ng password)
exports.registerCitizen = async (req, res) => {
    try {
        const { philSysId, firstName, lastName, email, password } = req.body;

        if (!password || password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters.' });
        }

        const identity = await philsysGateway.verifyPhilSysIdentity(philSysId, firstName, lastName);
        if (!identity.verified) {
            return res.status(400).json({ error: identity.error || 'Identity verification failed.' });
        }

        const hash = await bcrypt.hash(password, 10);
        const [rows] = await pool.query(
            'SELECT CitizenID, PasswordHash FROM CITIZEN WHERE PhilSysID = ?',
            [identity.philSysId]
        );

        if (rows.length && rows[0].PasswordHash !== 'PLACEHOLDER_HASH') {
            return res.status(409).json({ error: 'Account already registered.' });
        }

        if (rows.length) {
            await pool.query(
                `UPDATE CITIZEN SET PasswordHash = ?, FirstName = ?, LastName = ?,
                 Email = COALESCE(?, Email) WHERE CitizenID = ?`,
                [hash, identity.firstName, identity.lastName, email || null, rows[0].CitizenID]
            );
        } else {
            await pool.query(
                `INSERT INTO CITIZEN (PhilSysID, FirstName, LastName, Email, PasswordHash)
                 VALUES (?, ?, ?, ?, ?)`,
                [identity.philSysId, identity.firstName, identity.lastName, email || '', hash]
            );
        }

        return res.status(201).json({ message: 'Registration successful. You can now log in.' });
    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({ error: 'Registration failed.' });
    }
};

// CITIZEN LOGIN (PhilSysID + password; unique ang PhilSysID, ang email ay hindi)
exports.loginCitizen = async (req, res) => {
    try {
        const { philSysId, password } = req.body;
        if (!philSysId || !password) {
            return res.status(400).json({ error: 'PhilSys ID and password are required.' });
        }

        const [rows] = await pool.query(
            'SELECT CitizenID, PasswordHash FROM CITIZEN WHERE PhilSysID = ?',
            [philsysGateway.normalizePhilSysId(philSysId)]
        );
        const citizen = rows[0];

        // Parehong mensahe para hindi malaman kung alin ang mali
        if (!citizen || !(await bcrypt.compare(password, citizen.PasswordHash))) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        return res.json({ token: signToken({ id: citizen.CitizenID, role: 'citizen' }), role: 'citizen' });
    } catch (error) {
        console.error('Citizen login error:', error);
        return res.status(500).json({ error: 'Login failed.' });
    }
};

function philSysgateway_normalize(v) {
    return philsysGateway.normalizePhilSysId(v);
}

// STAFF LOGIN (EmployeeID + password)
exports.loginStaff = async (req, res) => {
    try {
        const { employeeId, password } = req.body;
        if (!employeeId || !password) {
            return res.status(400).json({ error: 'Employee ID and password are required.' });
        }

        const [rows] = await pool.query(
            'SELECT StaffID, OfficeCode, Role, PasswordHash FROM PSA_STAFF WHERE EmployeeID = ?',
            [employeeId]
        );
        const staff = rows[0];

        if (!staff || !(await bcrypt.compare(password, staff.PasswordHash))) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const role = STAFF_ROLE_MAP[staff.Role];
        if (!role) {
            return res.status(403).json({ error: 'This account has no system access.' });
        }

        return res.json({
            token: signToken({ id: staff.StaffID, role, officeCode: staff.OfficeCode }),
            role
        });
    } catch (error) {
        console.error('Staff login error:', error);
        return res.status(500).json({ error: 'Login failed.' });
    }
};