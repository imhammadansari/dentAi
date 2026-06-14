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
router.get('/stats', verifyToken('admin'), isAdmin, getAdminStats);
router.post('/register', verifyToken('admin'), isAdmin, adminRegister);
router.get('/verify', verifyToken('admin'), getAdmin);
router.post('/logout', verifyToken('admin'), adminLogout);
router.get('/all', verifyToken('admin'), isAdmin, getAllAdmins);
router.put('/:adminId', verifyToken('admin'), isAdmin, updateAdmin);
router.delete('/:adminId', verifyToken('admin'), isAdmin, deleteAdmin);

module.exports = router;