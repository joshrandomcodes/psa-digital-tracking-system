/**
 * PhilCRIS Legacy Civil Registry Database Adapter
 *
 * PhilCRIS remains an external authoritative repository. The adapter returns
 * a normalized result so the request workflow does not depend on its protocol.
 */
exports.checkPhilCrisRegistry = async (firstName, lastName) => {
    const normalizedFirstName = String(firstName || '').trim();
    const normalizedLastName = String(lastName || '').trim();

    if (!normalizedFirstName || !normalizedLastName) {
        return { recordFound: false, reason: 'Missing name fields.' };
    }

    // TODO: replace with the approved PhilCRIS integration/repository call.
    // The application must NOT fabricate a local CIVIL_RECORD because the
    // architecture defines PhilCRIS as the external source of truth.
    const recordExists = true;

    if (recordExists) {
        return {
            recordFound: true,
            recordId: `PHILCRIS-${Date.now()}`
        };
    }

    return {
        recordFound: false,
        reason: 'No matching PhilCRIS record was returned.'
    };
};
