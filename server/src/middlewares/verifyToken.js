const jwt = require('jsonwebtoken');
<<<<<<< HEAD
const { accessTokenCookieOptions, refreshTokenCookieOptions } = require('../utils/cookieOptions');
=======
const { accessTokenCookieOptions, COOKIE_NAMES } = require('../utils/cookieOptions');
>>>>>>> final-fixes
const patientModel = require('../models/patientModel');
const dentistModel = require('../models/dentistModel');
const adminModel = require('../models/adminModel');

<<<<<<< HEAD
// Attempts to issue a new accessToken using the refreshToken.
// On success: sets the accessToken cookie, sets req.user, and calls next().
// On failure: sends the appropriate 401/403 response.
const tryRefresh = async (req, res, next) => {
    // Accept refresh token from cookie OR Authorization-Refresh header OR query param
    let refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        const refreshHeader = req.headers['x-refresh-token'];
        if (refreshHeader) refreshToken = refreshHeader;
    }
    if (!refreshToken) {
        refreshToken = req.query.refreshToken ? decodeURIComponent(req.query.refreshToken) : null;
    }

    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            message: 'Access token missing/expired and no refresh token available'
        });
    }

    try {
        const refreshDecoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
        console.log('Refresh token decoded:', refreshDecoded);

        // Validate refresh token exists in DB for the correct role
        const role = refreshDecoded.role?.toLowerCase();
        let dbUser = null;

        if (role === 'patient') {
            dbUser = await patientModel.findOne({ refreshToken });
        } else if (role === 'dentist') {
            dbUser = await dentistModel.findOne({ refreshToken });
        } else if (role === 'admin') {
            dbUser = await adminModel.findOne({ refreshToken });
        }

        if (!dbUser) {
            return res.status(403).json({
                success: false,
                message: 'Refresh token revoked or not found'
            });
        }

        const newAccessToken = jwt.sign(
            {
                id: refreshDecoded.id,
                email: refreshDecoded.email,
                role: refreshDecoded.role
            },
            process.env.JWT_TOKEN,
            { expiresIn: '10h' }
        );

        // Set new access token as cookie
        res.cookie("accessToken", newAccessToken, accessTokenCookieOptions);

        // Also send it in response header so localStorage-based clients can pick it up
        res.setHeader('X-New-Access-Token', newAccessToken);

        req.user = refreshDecoded;
        console.log('New user from refresh token:', req.user);
        next();
    } catch (refreshError) {
        console.error('Refresh token error:', refreshError.message);
        return res.status(403).json({
            success: false,
            message: 'Refresh token invalid or expired'
        });
    }
};

const verifyToken = async (req, res, next) => {
=======
const tryRefresh = async (req, res, next, expectedRole) => {
    const role = expectedRole;
    const names = COOKIE_NAMES[role];
>>>>>>> final-fixes

    let refreshToken = names ? req.cookies[names.refresh] : null;

    // Fallback: x-refresh-token header
    if (!refreshToken) {
        const refreshHeader = req.headers['x-refresh-token'];
        if (refreshHeader) refreshToken = refreshHeader;
    }

<<<<<<< HEAD
    if (!accessToken) {
        accessToken = req.query.token ? decodeURIComponent(req.query.token) : null;
    }

    // No access token at all (e.g. it was deleted/expired and removed) —
    // fall back to the refresh token instead of failing immediately.
    if (!accessToken) {
        console.log('No access token, checking for refresh token');
        return tryRefresh(req, res, next);
=======
    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            message: 'Access token missing/expired and no refresh token available'
        });
>>>>>>> final-fixes
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
<<<<<<< HEAD
    } catch (error) {
        console.error('Token verification error:', error.message);

        if (error.name === 'TokenExpiredError') {
            console.log('Access token expired, checking for refresh token');
            return tryRefresh(req, res, next);
        } else {
            return res.status(403).json({
                success: false,
                message: 'Invalid access token'
            });
        }
    }
};

module.exports = { verifyToken };
=======
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
>>>>>>> final-fixes
