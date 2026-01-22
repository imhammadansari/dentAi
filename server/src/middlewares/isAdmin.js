// middlewares/isAdmin.js
const isAdmin = (req, res, next) => {
    try {
        console.log('isAdmin middleware called');
        console.log('User from request:', req.user);
        console.log('User role:', req.user?.role);
        
        // Check if user exists
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        // Check role - accept both "admin" and "Admin"
        const userRole = req.user.role?.toLowerCase();
        if (userRole !== 'admin') {
            return res.status(403).json({
                success: false,
                message: `Access denied. Admin only. Current role: ${req.user.role}`
            });
        }
        next();
    } catch (error) {
        console.error('isAdmin middleware error:', error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = { isAdmin };