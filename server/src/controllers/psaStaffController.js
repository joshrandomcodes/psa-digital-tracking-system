exports.makeDecision = async (req, res) => {
    const { requestId, decision } = req.body;

    if (decision === 'APPROVE') {
        res.status(200).json({
            requestId,
            finalStatus: "Approved",
            message: "Document Generated & Citizen Notified."
        });
    } else {
        res.status(200).json({
            requestId,
            finalStatus: "Rejected",
            message: "Rejection Notice dispatched to Citizen."
        });
    }
};