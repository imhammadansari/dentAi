const express = require('express');
const { patientRegister, userLogin, userLogout, refreshTokenGenerate, getPatient, testRoute, getPatientById, updatePatientProfile, getAllPatientsAdmin, deletePatient } = require('../controllers/patientController');
const { verifyToken } = require('../middlewares/verifyToken');
const { isAdmin } = require('../middlewares/isAdmin');
const { getPatientConsultations } = require('../controllers/bookingController');
const router = express.Router();

router.post('/register', patientRegister);
router.post('/login', userLogin);
router.post('/logout', verifyToken('patient'), userLogout);
router.post('/refresh-token', refreshTokenGenerate);
router.get("/my-consultations", verifyToken('patient'), getPatientConsultations);
router.put("/update-profile", verifyToken('patient'), updatePatientProfile);
router.get('/verify', verifyToken('patient'), getPatient);
router.get('/test', verifyToken('patient'), testRoute);
router.get('/admin/all', verifyToken('admin'), isAdmin, getAllPatientsAdmin);
router.delete('/admin/:id', verifyToken('admin'), isAdmin, deletePatient);
router.get("/:id", getPatientById);

module.exports = router;