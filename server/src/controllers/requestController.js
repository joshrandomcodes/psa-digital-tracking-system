const pool = require('../config/db');
const philsysGateway = require('../integrations/philsysGateway');
const philcrisAdapter = require('../integrations/philcrisAdapter');

const DEFAULT_DOCUMENT_TYPE = 'Birth Certificate (SECPA)';
const DEFAULT_OFFICE_CODE = 1;
const LCRO_QUEUE_STATUS = 'Pending LCRO Validation';

// SUBMIT DOCUMENT REQUEST (citizen lang)
exports.submitRequest = async (req, res) => {
    const { documentType, officeCode } = req.body;
    const citizenId = req.user.id; // galing sa token, hindi sa body

    let connection;

    try {
        const [citizens] = await pool.query(
            'SELECT PhilSysID, FirstName, LastName FROM CITIZEN WHERE CitizenID = ?',
            [citizenId]
        );
        if (citizens.length === 0) {
            return res.status(401).json({ status: 'Error', message: 'Account not found.' });
        }

        // 1. PHILSYS IDENTITY VERIFICATION (gamit ang naka-store na datos)
        const identity = await philsysGateway.verifyPhilSysIdentity(
            citizens[0].PhilSysID,
            citizens[0].FirstName,
            citizens[0].LastName
        );
        if (!identity.verified) {
            return res.status(400).json({
                status: 'Error',
                message: identity.error || 'Identity verification failed.'
            });
        }

        const normalizedFirstName = identity.firstName;
        const normalizedLastName = identity.lastName;
        const resolvedDocumentType = documentType || DEFAULT_DOCUMENT_TYPE;
        const resolvedOfficeCode = officeCode || DEFAULT_OFFICE_CODE;

        // 2. START DATABASE TRANSACTION
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // 3. CHECK FOR DUPLICATE ACTIVE REQUEST
        const [duplicates] = await connection.query(
            `SELECT RequestID FROM DOCUMENT_REQUEST
             WHERE CitizenID = ? AND DocumentType = ?
               AND RequestStatus IN ('Pending', 'Pending LCRO Validation', 'Under Review')`,
            [citizenId, resolvedDocumentType]
        );
        if (duplicates.length > 0) {
            await connection.rollback();
            return res.status(409).json({
                status: 'Error',
                message: 'Duplicate request already in progress.',
                requestId: duplicates[0].RequestID
            });
        }

        // 4. PHILCRIS RECORD CHECK
        const registry = await philcrisAdapter.checkPhilCrisRegistry(
            normalizedFirstName,
            normalizedLastName
        );

        // 5. ROUTING
        const requestStatus = LCRO_QUEUE_STATUS;
        const syncStatus = registry.recordFound ? 'Success' : 'Manual Review';
        const syncDetails = registry.recordFound
            ? `Record matched against PhilCRIS. Record reference: ${registry.recordId}`
            : `MANUAL FLAG: No matching PhilCRIS record found. Routed to LCRO dashboard for manual validation.${
                registry.reason ? ` ${registry.reason}` : ''
            }`;

        // 6. CREATE DOCUMENT REQUEST
        const [requestResult] = await connection.query(
            `INSERT INTO DOCUMENT_REQUEST
                (CitizenID, OfficeCode, DocumentType, RequestStatus, DateFiled)
             VALUES (?, ?, ?, ?, CURDATE())`,
            [citizenId, resolvedOfficeCode, resolvedDocumentType, requestStatus]
        );
        const requestId = requestResult.insertId;

        // 7. CREATE LCRO SYNC / VERIFICATION LOG
        await connection.query(
            `INSERT INTO LCRO_SYNC_LOG (RequestID, OfficeCode, SyncStatus, SyncDetails)
             VALUES (?, ?, ?, ?)`,
            [requestId, resolvedOfficeCode, syncStatus, syncDetails]
        );

        // 8. COMMIT
        await connection.commit();

        // 9. RESPONSE
        return res.status(201).json({
            message: registry.recordFound
                ? 'Request submitted and routed to the LCRO validation queue.'
                : 'Request submitted. No PhilCRIS record was found, so the request was manually flagged and routed to the LCRO dashboard.',
            requestId,
            status: requestStatus,
            philSysVerified: true,
            recordFound: registry.recordFound,
            manualFlag: !registry.recordFound,
            routedTo: 'LCRO'
        });

    } catch (error) {
        if (connection) {
            try {
                await connection.rollback();
            } catch (rollbackError) {
                console.error('Transaction rollback error:', rollbackError);
            }
        }
        console.error('Request submission error:', error);
        return res.status(500).json({ error: 'System routing error' });

    } finally {
        if (connection) connection.release();
    }
};

// LIST REQUESTS (nakadepende sa role)
exports.listRequests = async (req, res) => {
    try {
        const where = [];
        const params = [];

        switch (req.user.role) {
            case 'citizen':
                where.push('r.CitizenID = ?');
                params.push(req.user.id);
                break;
            case 'lcro':
                where.push('r.OfficeCode = ?');
                params.push(req.user.officeCode);
                break;
            case 'psa_staff':
                where.push("r.RequestStatus IN ('Under Review', 'Approved', 'Rejected')");
                break;
            case 'admin':
                break;
            default:
                return res.status(403).json({ error: 'You do not have access to this resource.' });
        }

        const [rows] = await pool.query(
            `
            SELECT
                r.RequestID, r.DocumentType, r.RequestStatus, r.DateFiled,
                c.FirstName, c.LastName, c.PhilSysID,
                l.SyncStatus  AS VerificationStatus,
                l.SyncDetails AS VerificationDetails
            FROM DOCUMENT_REQUEST r
            JOIN CITIZEN c ON c.CitizenID = r.CitizenID
            LEFT JOIN LCRO_SYNC_LOG l
                ON l.SyncID = (
                    SELECT l2.SyncID FROM LCRO_SYNC_LOG l2
                    WHERE l2.RequestID = r.RequestID
                    ORDER BY l2.SyncID DESC LIMIT 1
                )
            ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
            ORDER BY r.RequestID DESC
            `,
            params
        );

        return res.status(200).json(
            rows.map(row => {
                const out = { ...row, manualFlag: row.VerificationStatus === 'Manual Review' };
                if (req.user.role === 'citizen') {
                    // Panloob na tala ng LCRO; hindi dapat makita ng citizen
                    delete out.VerificationStatus;
                    delete out.VerificationDetails;
                    delete out.manualFlag;
                }
                return out;
            })
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Could not fetch requests' });
    }
};