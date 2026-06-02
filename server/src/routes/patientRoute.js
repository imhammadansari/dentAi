const express = require('express');
const { patientRegister, userLogin, userLogout, refreshTokenGenerate, getPatient, testRoute, getPatientById, updatePatientProfile, getAllPatientsAdmin, deletePatient } = require('../controllers/patientController');
const { verifyToken } = require('../middlewares/verifyToken');
const { isAdmin } = require('../middlewares/isAdmin');
const { getPatientConsultations } = require('../controllers/bookingController');
const router = express.Router();

router.post('/register', patientRegister);
router.post('/login', userLogin);
router.post('/logout', userLogout);
router.post('/refresh-token', refreshTokenGenerate);
router.get("/my-consultations", verifyToken, getPatientConsultations);
router.put("/update-profile", verifyToken, updatePatientProfile);
router.get('/verify', verifyToken, getPatient);
router.get('/test', verifyToken, testRoute);
router.get('/admin/all', verifyToken, isAdmin, getAllPatientsAdmin);
router.delete('/admin/:id', verifyToken, isAdmin, deletePatient);
router.get("/:id", getPatientById);

module.exports = router;