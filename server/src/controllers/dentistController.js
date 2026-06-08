const dentistModel = require("../models/dentistModel");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

const dentistRegister = async (req, res) => {
    try {
        const { name, email, password, specialty, licenseNumber, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required"
            });
        }

        let existingDentist = await dentistModel.findOne({ email });

        if (existingDentist) {
            return res.status(400).json({
                success: false,
                message: "Dentist with this email already exists"
            });
        }

        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Error generating salt",
                    error: err.message
                });
            }

            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: "Error hashing password",
                        error: err.message
                    });
                }

                try {
                    const dentist = await dentistModel.create({
                        name,
                        email,
                        password: hash,
                        specialty: specialty || "General Dentistry",
                        licenseNumber: licenseNumber || "",
                        phone: phone || "",
                        role: "dentist",
                        approvalStatus: "Pending"
                    });

                    res.status(201).json({
                        success: true,
                        message: "Dentist registration submitted for approval",
                        data: {
                            id: dentist._id,
                            name: dentist.name,
                            email: dentist.email,
                            specialty: dentist.specialty,
                            approvalStatus: dentist.approvalStatus,
                            role: dentist.role
                        }
                    });
                } catch (error) {
                    res.status(500).json({
                        success: false,
                        message: "Error creating dentist",
                        error: error.message
                    });
                }
            });
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
        console.log(error.message);
    }
};

const dentistLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const dentist = await dentistModel.findOne({ email });

        if (!dentist) {
            return res.status(404).json({
                success: false,
                message: "Dentist not found"
            });
        }

        if (dentist.approvalStatus !== "Approved") {
            return res.status(403).json({
                success: false,
                message: `Your account is ${dentist.approvalStatus}. Please wait for admin approval.`,
                approvalStatus: dentist.approvalStatus
            });
        }

        bcrypt.compare(password, dentist.password, async (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Error comparing password"
                });
            }

            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: "Invalid credentials"
                });
            }

            const accessToken = jwt.sign(
                {
                    email: dentist.email,
                    id: dentist._id,
                    role: dentist.role,
                    name: dentist.name
                },
                process.env.JWT_TOKEN,
                { expiresIn: "10h" }
            );

            const refreshToken = jwt.sign(
                {
                    email: dentist.email,
                    id: dentist._id,
                    role: dentist.role
                },
                process.env.REFRESH_TOKEN,
                { expiresIn: "7days" }
            );

            dentist.refreshToken = refreshToken;
            await dentist.save();

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
                    id: dentist._id,
                    name: dentist.name,
                    email: dentist.email,
                    specialty: dentist.specialty,
                    role: dentist.role,
                    approvalStatus: dentist.approvalStatus,
                    accessToken,
                    refreshToken
                }
            });
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
        console.log(error.message);
    }
};

const getDentist = async (req, res) => {
    try {
        const userId = req.user.id;

        const dentist = await dentistModel.findById(userId).select('-password');

        if (!dentist) {
            return res.status(404).json({
                success: false,
                message: 'Dentist not found'
            });
        }

        res.json({
            success: true,
            user: {
                id: dentist._id,
                name: dentist.name,
                email: dentist.email,
                specialty: dentist.specialty,
                phone: dentist.phone,
                licenseNumber: dentist.licenseNumber,
                role: dentist.role,
                approvalStatus: dentist.approvalStatus
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

const dentistLogout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    try {
        if (refreshToken) {
            const dentist = await dentistModel.findOne({ refreshToken });
            if (dentist) {
                dentist.refreshToken = null;
                await dentist.save();
            }
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

    } catch (err) {
        console.error("dentistLogout error:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};

const getPendingDentists = async (req, res) => {
    try {
        const pendingDentists = await dentistModel.find({
            approvalStatus: "Pending"
        }).select('-password');

        if (!pendingDentists) return req.send("No Pending Requests found");

        res.status(200).json({
            success: true,
            count: pendingDentists.length,
            data: pendingDentists
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const updateDentistStatus = async (req, res) => {
    try {
        const { dentistId } = req.params;
        const { status } = req.body;

        if (!["Approved", "Rejected"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be either 'Approved' or 'Rejected'"
            });
        }

        const dentist = await dentistModel.findByIdAndUpdate(
            dentistId,
            { approvalStatus: status },
            { new: true }
        ).select('-password');

        if (!dentist) {
            return res.status(404).json({
                success: false,
                message: "Dentist not found"
            });
        }

        res.status(200).json({
            success: true,
            message: `Dentist ${status.toLowerCase()} successfully`,
            data: dentist
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const getAllDentists = async (req, res) => {
    try {
        const dentists = await dentistModel.find().select("-password");

        if (!dentists) return res.status(404).send("No Dentists Found!");

        // console.log(dentists);

        res.status(200).json({
            success: true,
            message: "Fetched all dentists",
            data: dentists
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}

const deleteDentist = async (req, res) => {
    try {
        const { dentistId } = req.params;
        const dentist = await dentistModel.findByIdAndDelete(dentistId);
        if (!dentist) return res.status(404).json({ message: 'Dentist not found' });
        res.status(200).json({ success: true, message: 'Dentist deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    dentistRegister,
    dentistLogin,
    getDentist,
    dentistLogout,
    getPendingDentists,
    updateDentistStatus,
    getAllDentists,
    deleteDentist
};