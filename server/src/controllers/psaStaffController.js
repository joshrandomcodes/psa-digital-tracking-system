const pool = require('../config/db');

exports.makeDecision = async (req, res) => {
    const { requestId, decision, staffId } = req.body;

    try {
        const finalStatus = decision === 'APPROVE' ? 'Approved' : 'Rejected';

        await pool.query(
            'UPDATE DOCUMENT_REQUEST SET RequestStatus = ?, ReviewedByStaffID = ?, DecisionAt = NOW() WHERE RequestID = ?',
            [finalStatus, staffId || null, requestId]
        );

        const notificationType = decision === 'APPROVE' ? 'Document Approved' : 'Request Rejected';
        const message = decision === 'APPROVE'
            ? 'Your birth certificate request has been approved and is being generated.'
            : 'Your birth certificate request has been rejected. Please contact your LCRO for details.';

        await pool.query(
            `INSERT INTO NOTIFICATION_LOG (RequestID, Channel, NotificationType, Message)
             VALUES (?, 'Email', ?, ?)`,
            [requestId, notificationType, message]
        );

        res.status(200).json({
            requestId,
            finalStatus,
            message: decision === 'APPROVE' ? "Document Generated & Citizen Notified." : "Rejection Notice dispatched to Citizen."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Decision processing error", detail: error.message });
    }
};
