const pool = require('../config/db');
const philsysGateway = require('../integrations/philsysGateway');
const philcrisAdapter = require('../integrations/philcrisAdapter');

exports.submitRequest = async (req, res) => {
    const { philSysId, firstName, lastName, email, documentType, officeCode } = req.body;

    try {
        // 1. Verify identity via PhilSys (external, mocked until real gateway is wired)
        const identity = await philsysGateway.verifyPhilSysIdentity(philSysId, firstName, lastName);
        if (!identity.verified) {
            return res.status(400).json({ status: "Error", message: identity.error || "Identity verification failed." });
        }

        // 2. Find or create the citizen locally
        const [existingCitizens] = await pool.query(
            'SELECT CitizenID FROM CITIZEN WHERE PhilSysID = ?',
            [philSysId]
        );

        let citizenId;
        if (existingCitizens.length > 0) {
            citizenId = existingCitizens[0].CitizenID;
        } else {
            const [insertResult] = await pool.query(
                'INSERT INTO CITIZEN (PhilSysID, FirstName, LastName, Email) VALUES (?, ?, ?, ?)',
                [philSysId, firstName, lastName, email || null]
            );
            citizenId = insertResult.insertId;
        }

        // 3. Check for a duplicate request already in progress
        const [duplicates] = await pool.query(
            `SELECT RequestID FROM DOCUMENT_REQUEST
             WHERE CitizenID = ? AND DocumentType = ? AND RequestStatus IN ('Pending', 'Under Review')`,
            [citizenId, documentType || 'Birth Certificate (SECPA)']
        );
        if (duplicates.length > 0) {
            return res.status(400).json({ status: "Error", message: "Duplicate request already in progress." });
        }

        // 4. Check the record against PhilCRIS (external, mocked until real repository API is wired)
        const registry = await philcrisAdapter.checkPhilCrisRegistry(firstName, lastName);
        const initialStatus = registry.recordFound ? 'Pending' : 'Under Review'; // no match -> flagged for manual review

        // 5. Persist the request
        const [requestResult] = await pool.query(
            `INSERT INTO DOCUMENT_REQUEST (CitizenID, OfficeCode, DocumentType, RequestStatus, DateFiled)
             VALUES (?, ?, ?, ?, CURDATE())`,
            [citizenId, officeCode || 1, documentType || 'Birth Certificate (SECPA)', initialStatus]
        );

        res.status(201).json({
            message: "Request submitted successfully.",
            requestId: requestResult.insertId,
            status: initialStatus
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "System routing error", detail: error.message });
    }
};

exports.listRequests = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT r.RequestID, r.DocumentType, r.RequestStatus, r.DateFiled,
                    c.FirstName, c.LastName, c.PhilSysID
             FROM DOCUMENT_REQUEST r
             JOIN CITIZEN c ON c.CitizenID = r.CitizenID
             ORDER BY r.RequestID DESC`
        );
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not fetch requests", detail: error.message });
    }
};
