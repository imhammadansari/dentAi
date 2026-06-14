const patientModel = require("../models/patientModel");
const { accessTokenCookieOptions, refreshTokenCookieOptions, COOKIE_NAMES } = require('../utils/cookieOptions');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const bookingModel = require("../models/bookingModel");

const patientRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).send("All Fields are required");
        }

        let user = await patientModel.findOne({ email });
        if (user) return res.status(201).send("Patient already exist");

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) return res.send(err.message);
                let user = await patientModel.create({ name, email, password: hash });
                res.status(200).json({
                    success: true,
                    message: "Patient Registered Successfully",
                    data: { id: user._id, name: user.name, email: user.email, role: user.role }
                });
            });
        });
    } catch (error) {
        res.send(error.message);
    }
};

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.send("All fields are required");

        let user = await patientModel.findOne({ email });
        if (!user) return res.status(401).send("User does not exist");

        bcrypt.compare(password, user.password, async (err, result) => {
            if (err) return res.send("Something went wrong, Check your password");
            if (!result) return res.status(404).send("Invalid Credentials");

            let accessToken = jwt.sign(
                { email: user.email, id: user._id, role: user.role },
                process.env.JWT_TOKEN,
                { expiresIn: "10h" }
            );

            let refreshToken = jwt.sign(
                { email: user.email, id: user._id, role: user.role },
                process.env.REFRESH_TOKEN,
                { expiresIn: "7d" }
            );

            user.refreshToken = refreshToken;
            await user.save();

            res.cookie(COOKIE_NAMES.patient.access, accessToken, accessTokenCookieOptions);
            res.cookie(COOKIE_NAMES.patient.refresh, refreshToken, refreshTokenCookieOptions);

            res.status(200).json({
                success: true,
                message: "Loggedin successfully",
                data: { id: user._id, name: user.name, email: user.email, role: user.role }
            });
        });
    } catch (error) {
        res.send(error.message);
    }
};

const refreshTokenGenerate = async (req, res) => {
    const refreshToken = req.cookies[COOKIE_NAMES.patient.refresh];

    if (!refreshToken) return res.status(401).send("Refresh Token Missing");

    try {
        const user = await patientModel.findOne({ refreshToken });
        if (!user) return res.status(404).send("Invalid refreshtoken");

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
            if (err) return res.status(403).send("Invalid Refreshtoken");

            const newAccessToken = jwt.sign(
                { id: decoded.id, email: decoded.email, role: decoded.role },
                process.env.JWT_TOKEN,
                { expiresIn: '10h' }
            );

            res.cookie(COOKIE_NAMES.patient.access, newAccessToken, accessTokenCookieOptions);

            res.status(200).json({
                success: true,
                message: "new access token generated",
                accessToken: newAccessToken
            });
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getPatient = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await patientModel.findById(userId).select('-password');

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        res.json({
            success: true,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getPatientById = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await patientModel.findById(id);

        if (!patient) return res.status(404).json({ success: false, message: "Patient not found" });

        const bookings = await bookingModel.find({ patientId: id });

        res.status(200).json({
            success: true,
            data: { ...patient.toObject(), bookings }
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const testRoute = async (req, res) => {
    res.status(200).json({ message: 'Test route working' });
};

const userLogout = async (req, res) => {
    const refreshToken = req.cookies[COOKIE_NAMES.patient.refresh];

    if (!refreshToken) return res.status(401).send("No User found");

    try {
        const user = await patientModel.findOne({ refreshToken });

        if (user) {
            user.refreshToken = null;
            await user.save();
        }

        res.clearCookie(COOKIE_NAMES.patient.access, { httpOnly: true, sameSite: refreshTokenCookieOptions.sameSite, secure: refreshTokenCookieOptions.secure, path: '/' });
        res.clearCookie(COOKIE_NAMES.patient.refresh, { httpOnly: true, sameSite: refreshTokenCookieOptions.sameSite, secure: refreshTokenCookieOptions.secure, path: '/' });

        res.status(200).send("User Loggedout");
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getAllPatientsAdmin = async (req, res) => {
    try {
        const patients = await patientModel.find().select('-password -refreshToken');
        const allBookings = await bookingModel.find();

        const totalAppointments = allBookings.filter(b => ['Booked', 'Completed'].includes(b.status)).length;
        const upcomingCount = allBookings.filter(b => b.status === 'Booked').length;

        const visitMap = {};
        allBookings.forEach(b => {
            const pid = b.patientId?.toString();
            if (pid) visitMap[pid] = (visitMap[pid] || 0) + 1;
        });

        const patientsData = patients.map(p => ({
            id: p._id,
            name: p.name,
            email: p.email,
            phone: p.phone || null,
            age: p.age || null,
            gender: p.gender || null,
            totalVisits: visitMap[p._id.toString()] || 0,
            createdAt: p.createdAt
        }));

        res.status(200).json({
            success: true,
            data: patientsData,
            stats: { totalPatients: patients.length, totalAppointments, upcomingCount, totalReports: 0 }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await patientModel.findByIdAndDelete(id);
        if (!patient) return res.status(404).json({ message: 'Patient not found' });
        await bookingModel.deleteMany({ patientId: id });
        res.status(200).json({ success: true, message: 'Patient deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePatientProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { phone, gender, age } = req.body;
        const updated = await patientModel.findByIdAndUpdate(
            userId,
            { phone, gender, age },
            { new: true }
        ).select('-password -refreshToken');

        if (!updated) return res.status(404).json({ message: 'Patient not found' });

        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    patientRegister, userLogin, refreshTokenGenerate, getPatient,
    testRoute, userLogout, getPatientById, getAllPatientsAdmin,
    deletePatient, updatePatientProfile
};