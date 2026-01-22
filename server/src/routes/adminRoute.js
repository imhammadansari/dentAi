const express = require('express');
const { 
    createFirstAdmin,
    adminRegister, 
    adminLogin, 
    getAdmin, 
    adminLogout,
    getAllAdmins,
    updateAdmin,
    deleteAdmin
} = require('../controllers/adminController');
const { verifyToken } = require('../middlewares/verifyToken');
const { isAdmin } = require('../middlewares/isAdmin');

const router = express.Router();

// Create first admin (seed route - remove in production)
router.get('/seed', createFirstAdmin);

// Public routes
router.post('/login', adminLogin);

// Protected admin routes
router.post('/register', verifyToken, isAdmin, adminRegister);
router.get('/verify', verifyToken, getAdmin);
router.post('/logout', verifyToken, adminLogout);
router.get('/all', verifyToken, isAdmin, getAllAdmins);
router.put('/:adminId', verifyToken, isAdmin, updateAdmin);
router.delete('/:adminId', verifyToken, isAdmin, deleteAdmin);

module.exports = router;