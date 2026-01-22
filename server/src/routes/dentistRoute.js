const express = require('express');
const {
    dentistRegister,
    dentistLogin,
    getDentist,
    dentistLogout,
    getPendingDentists,
    updateDentistStatus
} = require('../controllers/dentistController');
const { verifyToken } = require('../middlewares/verifyToken');
const { isAdmin } = require('../middlewares/isAdmin');

const router = express.Router();

// Public routes
router.post('/register', dentistRegister);
router.post('/login', dentistLogin);

// Protected routes (dentist only)
router.get('/verify', verifyToken, getDentist);
router.post('/logout', verifyToken, dentistLogout);

// Admin routes
router.get('/pending', verifyToken, isAdmin, getPendingDentists);
router.put('/:dentistId/status', verifyToken, isAdmin, updateDentistStatus);

module.exports = router;