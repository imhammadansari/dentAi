const express = require('express');
const { 
    createFirstAdmin, adminRegister, adminLogin, getAdmin, adminLogout,
    getAllAdmins, updateAdmin, deleteAdmin, getAdminStats
} = require('../controllers/adminController');
const { verifyToken } = require('../middlewares/verifyToken');
const { isAdmin } = require('../middlewares/isAdmin');

const router = express.Router();

router.get('/seed', createFirstAdmin);
router.post('/login', adminLogin);
router.get('/stats', verifyToken, isAdmin, getAdminStats);
router.post('/register', verifyToken, isAdmin, adminRegister);
router.get('/verify', verifyToken, getAdmin);
router.post('/logout', verifyToken, adminLogout);
router.get('/all', verifyToken, isAdmin, getAllAdmins);
router.put('/:adminId', verifyToken, isAdmin, updateAdmin);
router.delete('/:adminId', verifyToken, isAdmin, deleteAdmin);

module.exports = router;