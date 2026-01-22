const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    console.log('=== VERIFY TOKEN MIDDLEWARE ===');
    console.log('Cookies:', req.cookies);
    
    let accessToken = req.cookies.accessToken;
    
    if (!accessToken) {
        console.log('No access token in cookies');
        return res.status(401).json({ 
            success: false, 
            message: 'Access token required' 
        });
    }

    try {
        // Verify access token
        const decoded = jwt.verify(accessToken, process.env.JWT_TOKEN);
        console.log('Token decoded successfully:', decoded);
        
        // Make sure role is included
        if (!decoded.role) {
            console.log('No role found in token');
            // Try to get role from ID
            // You might need to fetch user from database here
        }
        
        req.user = decoded;
        console.log('User attached to request:', req.user);
        next();
    } catch (error) {
        console.error('Token verification error:', error.message);
        
        if (error.name === 'TokenExpiredError') {
            console.log('Access token expired, checking for refresh token');
            
            // Check for refresh token
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return res.status(401).json({
                    success: false,
                    message: 'Access token expired and no refresh token available'
                });
            }
            
            try {
                // Verify refresh token
                const refreshDecoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
                console.log('Refresh token decoded:', refreshDecoded);
                
                // Generate new access token
                const newAccessToken = jwt.sign(
                    { 
                        id: refreshDecoded.id, 
                        email: refreshDecoded.email,
                        role: refreshDecoded.role 
                    },
                    process.env.JWT_TOKEN,
                    { expiresIn: '10h' }
                );
                
                // Set new access token in cookie
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