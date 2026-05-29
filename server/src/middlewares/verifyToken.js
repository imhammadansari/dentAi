const jwt = require('jsonwebtoken');
const patientModel = require('../models/patientModel');
const dentistModel = require('../models/dentistModel');
const adminModel = require('../models/adminModel');

const verifyToken = async (req, res, next) => {

    console.log("=== verifyToken hit ===");
    console.log("cookies:", req.cookies);
    console.log("auth header:", req.headers.authorization);

    let accessToken = req.cookies.accessToken;

    // Also accept Bearer token from Authorization header
    if (!accessToken) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            accessToken = authHeader.split(" ")[1];
        }
    }

    if (!accessToken) {
        accessToken = req.query.token ? decodeURIComponent(req.query.token) : null;
    }

    if (!accessToken) {
        return res.status(401).json({
            success: false,
            message: 'Access token required'
        });
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_TOKEN);

        if (!decoded.role) {
            console.log('No role found in token');
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error.message);

        if (error.name === 'TokenExpiredError') {
            console.log('Access token expired, checking for refresh token');

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
                    message: 'Access token expired and no refresh token available'
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
                res.cookie("accessToken", newAccessToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'None',
                    maxAge: 10 * 60 * 60 * 1000
                });

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
        } else {
            return res.status(403).json({
                success: false,
                message: 'Invalid access token'
            });
        }
    }
};

module.exports = { verifyToken };