// patientRoute.js
const express = require('express');
const { patientRegister, userLogin, userLogout, refreshTokenGenerate, getPatient, testRoute, getPatientById } = require('../controllers/patientController');
const { verifyToken } = require('../middlewares/verifyToken');
const { getPatientConsultations } = require('../controllers/bookingController');
const router = express.Router();

router.post('/register', patientRegister);
router.post('/login', userLogin);
router.post('/logout', userLogout);
router.post('/refresh-token', refreshTokenGenerate);
router.get("/my-consultations", verifyToken, getPatientConsultations);
router.get("/:id", getPatientById);
router.get('/verify', verifyToken, getPatient); // Add role here
router.get('/test', verifyToken, testRoute); // Keep for compatibility

module.exports = router;