/**
 * PhilSys Gateway Identity Verification
 *
 * This module is intentionally kept behind an integration boundary. The real
 * PhilSys/PSA service can be wired here without changing requestController.
 */

const PHILSYS_ID_PATTERN = /^\d{4}-\d{4}-\d{4}$/;

function normalizePhilSysId(value) {
    return String(value || '').trim().replace(/\s+/g, '');
}

exports.normalizePhilSysId = normalizePhilSysId;

exports.verifyPhilSysIdentity = async (philSysId, firstName, lastName) => {
    const normalizedId = normalizePhilSysId(philSysId);
    const normalizedFirstName = String(firstName || '').trim();
    const normalizedLastName = String(lastName || '').trim();

    if (!normalizedFirstName || !normalizedLastName) {
        return { verified: false, error: 'First name and last name are required.' };
    }

    if (!PHILSYS_ID_PATTERN.test(normalizedId)) {
        return {
            verified: false,
            error: 'Invalid PhilSys ID format. Expected 12 digits in XXXX-XXXX-XXXX format.'
        };
    }

    // Integration stub: a real PSA/PhilSys response must be mapped here.
    // Do not treat a syntactically valid ID as proof of identity in production.
    return {
        verified: true,
        philSysId: normalizedId,
        firstName: normalizedFirstName,
        lastName: normalizedLastName,
        message: 'PhilSys identity verification passed the configured gateway checks.'
    };
};
