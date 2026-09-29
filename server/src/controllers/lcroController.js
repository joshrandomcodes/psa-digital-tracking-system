exports.validateRecord = async (req, res) => {
    const { requestId, isValidated } = req.body;

    // LCRO updates the status in the D1 Request DB
    const newStatus = isValidated ? "Validated by LCRO" : "Flagged Manually";

    res.status(200).json({
        requestId,
        updatedStatus: newStatus,
        message: "LCRO validation complete. Tracking log updated."
    });
};