const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
        return res.status(401).json({ error: 'Authentication required.' });
    }
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET); // { id, role, officeCode }
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
}

// Deny by default
function authorize(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'You do not have access to this resource.' });
        }
        next();
    };
}

module.exports = { authenticate, authorize };