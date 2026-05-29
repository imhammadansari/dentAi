const jwt = require('jsonwebtoken');

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
        // console.log('Token decoded successfully:', decoded);

        if (!decoded.role) {
            console.log('No role found in token');
        }

        req.user = decoded;
        // console.log('User attached to request:', req.user);
        next();
    } catch (error) {
        console.error('Token verification error:', error.message);

        if (error.name === 'TokenExpiredError') {
            console.log('Access token expired, checking for refresh token');

            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return res.status(401).json({
                    success: false,
                    message: 'Access token expired and no refresh token available'
                });
            }

            try {
                const refreshDecoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
                console.log('Refresh token decoded:', refreshDecoded);

                const newAccessToken = jwt.sign(
                    {
                        id: refreshDecoded.id,
                        email: refreshDecoded.email,
                        role: refreshDecoded.role
                    },
                    process.env.JWT_TOKEN,
                    { expiresIn: '10h' }
                );

                res.cookie("accessToken", newAccessToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'None',
                    maxAge: 10 * 60 * 60 * 1000
                });

                // Attach user to request
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