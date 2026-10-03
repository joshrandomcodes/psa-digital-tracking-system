const pool = require('../config/db');

const philsysGateway =
    require('../integrations/philsysGateway');

const philcrisAdapter =
    require('../integrations/philcrisAdapter');


const DEFAULT_DOCUMENT_TYPE =
    'Birth Certificate (SECPA)';

const DEFAULT_OFFICE_CODE = 1;

const LCRO_QUEUE_STATUS =
    'Pending LCRO Validation';


// SUBMIT DOCUMENT REQUEST
exports.submitRequest = async (req, res) => {

    const {
        philSysId,
        firstName,
        lastName,
        email,
        documentType,
        officeCode
    } = req.body;

    let connection;

    try {

        // 1. PHILSYS IDENTITY VERIFICATION
        const identity =
            await philsysGateway.verifyPhilSysIdentity(
                philSysId,
                firstName,
                lastName
            );

        if (!identity.verified) {

            return res.status(400).json({
                status: 'Error',
                message:
                    identity.error ||
                    'Identity verification failed.'
            });
        }


        const normalizedPhilSysId =
            identity.philSysId;

        const normalizedFirstName =
            identity.firstName;

        const normalizedLastName =
            identity.lastName;


        const resolvedDocumentType =
            documentType ||
            DEFAULT_DOCUMENT_TYPE;

        const resolvedOfficeCode =
            officeCode ||
            DEFAULT_OFFICE_CODE;


        // 2. START DATABASE TRANSACTION
        connection =
            await pool.getConnection();

        await connection.beginTransaction();


        // 3. FIND OR CREATE CITIZEN
        const [existingCitizens] =
            await connection.query(
                `
                SELECT CitizenID
                FROM CITIZEN
                WHERE PhilSysID = ?
                `,
                [normalizedPhilSysId]
            );


        let citizenId;


        if (existingCitizens.length > 0) {

            citizenId =
                existingCitizens[0].CitizenID;


            await connection.query(
                `
                UPDATE CITIZEN
                SET
                    FirstName = ?,
                    LastName = ?,
                    Email = COALESCE(?, Email)
                WHERE CitizenID = ?
                `,
                [
                    normalizedFirstName,
                    normalizedLastName,
                    email || null,
                    citizenId
                ]
            );

        } else {

            const [insertResult] =
                await connection.query(
                    `
                    INSERT INTO CITIZEN
                        (
                            PhilSysID,
                            FirstName,
                            LastName,
                            Email
                        )
                    VALUES (?, ?, ?, ?)
                    `,
                    [
                        normalizedPhilSysId,
                        normalizedFirstName,
                        normalizedLastName,
                        email || ''
                    ]
                );


            citizenId =
                insertResult.insertId;
        }


        // 4. CHECK FOR DUPLICATE ACTIVE REQUEST
        const [duplicates] =
            await connection.query(
                `
                SELECT RequestID
                FROM DOCUMENT_REQUEST
                WHERE CitizenID = ?
                  AND DocumentType = ?
                  AND RequestStatus IN
                    (
                        'Pending',
                        'Pending LCRO Validation',
                        'Under Review'
                    )
                `,
                [
                    citizenId,
                    resolvedDocumentType
                ]
            );


        if (duplicates.length > 0) {

            await connection.rollback();

            return res.status(409).json({
                status: 'Error',
                message:
                    'Duplicate request already in progress.',
                requestId:
                    duplicates[0].RequestID
            });
        }


        // 5. PHILCRIS RECORD CHECK
        const registry =
            await philcrisAdapter.checkPhilCrisRegistry(
                normalizedFirstName,
                normalizedLastName
            );


        // 6. ACTIVITY DIAGRAM ROUTING
        const requestStatus =
            LCRO_QUEUE_STATUS;


        const syncStatus =
            registry.recordFound
                ? 'Success'
                : 'Manual Review';


        const syncDetails =
            registry.recordFound

                ? `Record matched against PhilCRIS. Record reference: ${registry.recordId}`

                : `MANUAL FLAG: No matching PhilCRIS record found. Routed to LCRO dashboard for manual validation.${
                    registry.reason
                        ? ` ${registry.reason}`
                        : ''
                }`;


        // 7. CREATE DOCUMENT REQUEST
        const [requestResult] =
            await connection.query(
                `
                INSERT INTO DOCUMENT_REQUEST
                    (
                        CitizenID,
                        OfficeCode,
                        DocumentType,
                        RequestStatus,
                        DateFiled
                    )
                VALUES (?, ?, ?, ?, CURDATE())
                `,
                [
                    citizenId,
                    resolvedOfficeCode,
                    resolvedDocumentType,
                    requestStatus
                ]
            );


        const requestId =
            requestResult.insertId;


        // 8. CREATE LCRO SYNC / VERIFICATION LOG
        await connection.query(
            `
            INSERT INTO LCRO_SYNC_LOG
                (
                    RequestID,
                    OfficeCode,
                    SyncStatus,
                    SyncDetails
                )
            VALUES (?, ?, ?, ?)
            `,
            [
                requestId,
                resolvedOfficeCode,
                syncStatus,
                syncDetails
            ]
        );


        // 9. COMMIT
        await connection.commit();


        // 10. RESPONSE
        return res.status(201).json({

            message:
                registry.recordFound

                    ? 'Request submitted and routed to the LCRO validation queue.'

                    : 'Request submitted. No PhilCRIS record was found, so the request was manually flagged and routed to the LCRO dashboard.',

            requestId,

            status:
                requestStatus,

            philSysVerified:
                true,

            recordFound:
                registry.recordFound,

            manualFlag:
                !registry.recordFound,

            routedTo:
                'LCRO'
        });


    } catch (error) {

        if (connection) {

            try {
                await connection.rollback();

            } catch (rollbackError) {

                console.error(
                    'Transaction rollback error:',
                    rollbackError
                );
            }
        }


        console.error(
            'Request submission error:',
            error
        );


        return res.status(500).json({

            error:
                'System routing error',

            detail:
                error.message
        });


    } finally {

        if (connection) {
            connection.release();
        }
    }
};


// LIST REQUESTS
exports.listRequests = async (req, res) => {

    try {

        const [rows] =
            await pool.query(
                `
                SELECT
                    r.RequestID,
                    r.DocumentType,
                    r.RequestStatus,
                    r.DateFiled,

                    c.FirstName,
                    c.LastName,
                    c.PhilSysID,

                    l.SyncStatus
                        AS VerificationStatus,

                    l.SyncDetails
                        AS VerificationDetails

                FROM DOCUMENT_REQUEST r

                JOIN CITIZEN c
                    ON c.CitizenID =
                       r.CitizenID

                LEFT JOIN LCRO_SYNC_LOG l
                    ON l.SyncID = (
                        SELECT l2.SyncID

                        FROM LCRO_SYNC_LOG l2

                        WHERE l2.RequestID =
                              r.RequestID

                        ORDER BY l2.SyncID DESC

                        LIMIT 1
                    )

                ORDER BY
                    r.RequestID DESC
                `
            );

        return res.status(200).json(
            rows.map(row => ({
                ...row,
                manualFlag:
                    row.VerificationStatus ===
                    'Manual Review'

            }))
        );
        
    } catch (error) {

        console.error(error);

        return res.status(500).json({

            error:
                'Could not fetch requests',

            detail:
                error.message
        });
    }
};
