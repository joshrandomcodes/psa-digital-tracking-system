const pool = require('../config/db');

const LCRO_QUEUE_STATUS =
    'Pending LCRO Validation';

// GET LCRO VALIDATION QUEUE
exports.listValidationQueue =
    async (req, res) => {
        try {
            const [rows] =
                await pool.query(
                    `
                    SELECT
                        r.RequestID,
                        r.DocumentType,
                        r.RequestStatus,
                        r.DateFiled,
                        r.OfficeCode,
                        c.CitizenID,
                        c.FirstName,
                        c.LastName,
                        c.PhilSysID,
                        c.Email,
                        l.SyncStatus
                            AS VerificationStatus,
                        l.SyncDetails
                            AS VerificationDetails,
                        l.SyncedAt
                            AS VerificationAt
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
                            ORDER BY
                                l2.SyncID DESC
                            LIMIT 1
                        )
                    WHERE
                        r.RequestStatus = ?
                    ORDER BY
                        r.RequestID DESC
                    `,
                    [LCRO_QUEUE_STATUS]
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
                    'Could not fetch LCRO validation queue',
                detail:
                    error.message
            });
        }
    };

// LCRO MANUAL VALIDATION
exports.validateRecord =
    async (req, res) => {
        const {
            requestId,
            isValidated,
            officeCode
        } = req.body;

        if (
            !requestId ||
            typeof isValidated !== 'boolean'
        ) {
            return res.status(400).json({
                error:
                    'requestId and boolean isValidated are required.'
            });
        }

        const connection =
            await pool.getConnection();

        try {
            await connection.beginTransaction();

            // Lock request during validation
            const [requests] =
                await connection.query(
                    `
                    SELECT
                        RequestID,
                        OfficeCode,
                        RequestStatus
                    FROM DOCUMENT_REQUEST
                    WHERE RequestID = ?
                    FOR UPDATE
                    `,
                    [requestId]
                );

            if (requests.length === 0) {
                await connection.rollback();
                return res.status(404).json({
                    error:
                        'Request not found.'
                });
            }

            const request =
                requests[0];

            if (
                request.RequestStatus !==
                LCRO_QUEUE_STATUS
            ) {
                await connection.rollback();
                return res.status(409).json({
                    error:
                        'Request is not currently waiting for LCRO validation.',
                    status:
                        request.RequestStatus
                });
            }

            // LCRO DECISION
            const newStatus =
                isValidated
                    ? 'Under Review'
                    : 'Rejected';

            const resolvedOfficeCode =
                officeCode ||
                request.OfficeCode;

            // Update request
            await connection.query(
                `
                UPDATE DOCUMENT_REQUEST
                SET RequestStatus = ?
                WHERE RequestID = ?
                `,
                [
                    newStatus,
                    requestId
                ]
            );

            // Log LCRO decision
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
                    isValidated
                        ? 'Success'
                        : 'Failed',
                    isValidated
                        ? 'LCRO manually validated the civil registry record. Request routed to PSA staff review.'
                        : 'LCRO manually reviewed the request and could not validate the civil registry record.'
                ]
            );

            await connection.commit();

            return res.status(200).json({
                requestId,
                updatedStatus:
                    newStatus,
                message:
                    isValidated
                        ? 'LCRO validation complete. Request routed to PSA staff review.'
                        : 'LCRO validation complete. Request rejected.'
            });

        } catch (error) {
            try {
                await connection.rollback();
            } catch (rollbackError) {
                console.error(
                    'Transaction rollback error:',
                    rollbackError
                );
            }

            console.error(error);

            return res.status(500).json({
                error:
                    'LCRO validation error',
                detail:
                    error.message
            });

        } finally {
            connection.release();
        }
    };
