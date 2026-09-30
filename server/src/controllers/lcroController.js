const pool = require('../config/db');

exports.validateRecord = async (req, res) => {
    const { requestId, isValidated, officeCode } = req.body;

    try {
        const newStatus = isValidated ? 'Under Review' : 'Rejected';

        await pool.query(
            'UPDATE DOCUMENT_REQUEST SET RequestStatus = ? WHERE RequestID = ?',
            [newStatus, requestId]
        );

        await pool.query(
            `INSERT INTO LCRO_SYNC_LOG (RequestID, OfficeCode, SyncStatus, SyncDetails)
             VALUES (?, ?, ?, ?)`,
            [
                requestId,
                officeCode || 1,
                isValidated ? 'Success' : 'Failed',
                isValidated ? 'Record matched against PhilCRIS.' : 'No matching record found in PhilCRIS.'
            ]
        );

        res.status(200).json({
            requestId,
            updatedStatus: newStatus,
            message: "LCRO validation complete. Sync log updated."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "LCRO validation error", detail: error.message });
    }
};
