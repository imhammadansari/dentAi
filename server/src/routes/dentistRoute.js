const express = require('express');
const {
    dentistRegister,
    dentistLogin,
    getDentist,
    dentistLogout,
    getPendingDentists,
    updateDentistStatus,
    getAllDentists
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

router.get('/get-dentists', verifyToken, getAllDentists);

// Admin routes
router.get('/pending', verifyToken, isAdmin, getPendingDentists);
router.put('/:dentistId/status', verifyToken, isAdmin, updateDentistStatus);

module.exports = router;