const adminModel = require("../models/adminModel");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

const createFirstAdmin = async () => {
    try {
        const adminExists = await adminModel.findOne({ email: 'admin@dentai.com' });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('Admin@123', 10);
            await adminModel.create({
                name: 'System Administrator',
                email: 'admin@dentai.com',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('First admin created successfully');
        }
    } catch (error) {
        console.error('Error creating first admin:', error);
    }
};

const adminRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if admin already exists
        let existingAdmin = await adminModel.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: "Admin with this email already exists"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // Create new admin
        const admin = await adminModel.create({
            name,
            email,
            password: hash,
            role: "admin"
        });

        res.status(201).json({
            success: true,
            message: "Admin created successfully",
            data: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const admin = await adminModel.findOne({ email });

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const accessToken = jwt.sign(
            {
                email: admin.email,
                id: admin._id,
                role: admin.role,
                name: admin.name
            },
            process.env.JWT_TOKEN,
            { expiresIn: "10h" }
        );

        const refreshToken = jwt.sign(
            {
                email: admin.email,
                id: admin._id,
                role: admin.role
            },
            process.env.REFRESH_TOKEN,
            { expiresIn: "7days" }
        );

        admin.refreshToken = refreshToken;
        await admin.save();

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 10 * 60 * 60 * 1000
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                permissions: admin.permissions,
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const getAdmin = async (req, res) => {
    try {
        const userId = req.user.id;

        const admin = await adminModel.findById(userId).select('-password');

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        res.json({
            success: true,
            user: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                permissions: admin.permissions
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

const adminLogout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            message: "No refresh token found"
        });
    }

    try {
        const admin = await adminModel.findOne({ refreshToken });

        if (admin) {
            admin.refreshToken = null;
            await admin.save();
        }

        res.clearCookie("accessToken", {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            path: '/'
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            path: '/'
        });

        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

const getAllAdmins = async (req, res) => {
    try {
        const admins = await adminModel.find().select('-password');

        res.status(200).json({
            success: true,
            count: admins.length,
            data: admins
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// Update Admin
const updateAdmin = async (req, res) => {
    try {
        const { adminId } = req.params;
        const updateData = req.body;

        // Don't allow password update via this route
        if (updateData.password) {
            delete updateData.password;
        }

        const admin = await adminModel.findByIdAndUpdate(
            adminId,
            updateData,
            { new: true }
        ).select('-password');

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Admin updated successfully",
            data: admin
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// Delete Admin
const deleteAdmin = async (req, res) => {
    try {
        const { adminId } = req.params;

        // Prevent deleting self
        if (req.user.id === adminId) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete your own account"
            });
        }

        const admin = await adminModel.findByIdAndDelete(adminId);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Admin deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    createFirstAdmin,
    adminRegister,
    adminLogin,
    getAdmin,
    adminLogout,
    getAllAdmins,
    updateAdmin,
    deleteAdmin
};