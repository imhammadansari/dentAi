const jwt = require('jsonwebtoken');
const { accessTokenCookieOptions, COOKIE_NAMES } = require('../utils/cookieOptions');
const patientModel = require('../models/patientModel');
const dentistModel = require('../models/dentistModel');
const adminModel = require('../models/adminModel');

const tryRefresh = async (req, res, next, expectedRole) => {
    const role = expectedRole;
    const names = COOKIE_NAMES[role];

    let refreshToken = names ? req.cookies[names.refresh] : null;

    // Fallback: x-refresh-token header
    if (!refreshToken) {
        const refreshHeader = req.headers['x-refresh-token'];
        if (refreshHeader) refreshToken = refreshHeader;
    }

    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            message: 'Access token missing/expired and no refresh token available'
        });
    }

    try {
        const refreshDecoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);

        let dbUser = null;
        if (role === 'patient') dbUser = await patientModel.findOne({ refreshToken });
        else if (role === 'dentist') dbUser = await dentistModel.findOne({ refreshToken });
        else if (role === 'admin') dbUser = await adminModel.findOne({ refreshToken });

        if (!dbUser) {
            return res.status(403).json({ success: false, message: 'Refresh token revoked or not found' });
        }

        const newAccessToken = jwt.sign(
            { id: refreshDecoded.id, email: refreshDecoded.email, role: refreshDecoded.role },
            process.env.JWT_TOKEN,
            { expiresIn: '10h' }
        );

        if (names) {
            res.cookie(names.access, newAccessToken, accessTokenCookieOptions);
        }

        req.user = refreshDecoded;
        next();
    } catch (refreshError) {
        console.error('Refresh token error:', refreshError.message);
        return res.status(403).json({ success: false, message: 'Refresh token invalid or expired' });
    }
};

// Factory function — call with the expected role for the route
// e.g. verifyToken('patient'), verifyToken('dentist'), verifyToken('admin')
const verifyToken = (expectedRole) => async (req, res, next) => {
    const names = COOKIE_NAMES[expectedRole];

    // Read only the cookie for the expected role
    let accessToken = names ? req.cookies[names.access] : null;

    // Fallback: Bearer token from Authorization header
    if (!accessToken) {
        const authHeader = req.headers.authorization;
        if (authHeader?.startsWith('Bearer ')) {
            accessToken = authHeader.split(' ')[1];
        }
    }

    if (!accessToken) {
        return tryRefresh(req, res, next, expectedRole);
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_TOKEN);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return tryRefresh(req, res, next, expectedRole);
        }
        return res.status(403).json({ success: false, message: 'Invalid access token' });
    }
};

// For routes accessed by multiple roles (e.g. chat used by both patient and dentist)
const verifyAnyToken = async (req, res, next) => {
    for (const role of Object.keys(COOKIE_NAMES)) {
        const names = COOKIE_NAMES[role];
        const accessToken = req.cookies[names.access];
        if (accessToken) {
            try {
                const decoded = jwt.verify(accessToken, process.env.JWT_TOKEN);
                req.user = decoded;
                return next();
            } catch (err) {
                if (err.name === 'TokenExpiredError') {
                    return tryRefresh(req, res, next, role);
                }
            }
        }
    }
    // No valid access token found — try refresh for any role
    for (const role of Object.keys(COOKIE_NAMES)) {
        const names = COOKIE_NAMES[role];
        if (req.cookies[names.refresh]) {
            return tryRefresh(req, res, next, role);
        }
    }
    return res.status(401).json({ success: false, message: 'Not authenticated' });
};

module.exports = { verifyToken, verifyAnyToken };
