const philsysGateway = require('../integrations/philsysGateway');
const philcrisAdapter = require('../integrations/philcrisAdapter');

exports.submitRequest = async (req, res) => {
    const { philSysId, firstName, lastName, requestType } = req.body;

    try {
        // 1. Verify Identity
        const identity = await philsysGateway.verifyPhilSysIdentity(philSysId, firstName, lastName);
        if (!identity.verified) {
            return res.status(400).json({ status: "Error", message: "Identity verification failed." });
        }

        // 2. Check Duplicate (Mocked)
        const isDuplicate = false; 
        if (isDuplicate) {
            return res.status(400).json({ status: "Error", message: "Duplicate request found." });
        }

        // 3. Check Record in PhilCRIS
        const registry = await philcrisAdapter.checkPhilCrisRegistry(firstName, lastName);
        
        let initialStatus = "Pending LCRO Validation";
        if (!registry.recordFound) {
            initialStatus = "Flagged Manually"; // Activity diagram branch for missing records
        }

        // Return success to Citizen
        res.status(201).json({
            message: "Request submitted successfully.",
            requestId: Math.floor(Math.random() * 100000),
            status: initialStatus
        });

    } catch (error) {
        res.status(500).json({ error: "System routing error" });
    }
};