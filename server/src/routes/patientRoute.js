// patientRoute.js
const express = require('express');
const { patientRegister, userLogin, userLogout, refreshTokenGenerate, getPatient, testRoute } = require('../controllers/patientController');
const { verifyToken } = require('../middlewares/verifyToken');
const router = express.Router();

router.post('/register', patientRegister);
router.post('/login', userLogin);
router.post('/logout', userLogout);
router.post('/refresh-token', refreshTokenGenerate);
router.get('/verify', verifyToken, getPatient); // Add role here
router.get('/test', verifyToken, testRoute); // Keep for compatibility

module.exports = router;