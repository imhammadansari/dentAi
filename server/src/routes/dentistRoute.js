const express = require('express');
const {
    dentistRegister, dentistLogin, getDentist, dentistLogout,
    getPendingDentists, updateDentistStatus, getAllDentists, deleteDentist
} = require('../controllers/dentistController');
const { verifyToken } = require('../middlewares/verifyToken');
const { isAdmin } = require('../middlewares/isAdmin');

const router = express.Router();

router.post('/register', dentistRegister);
router.post('/login', dentistLogin);
router.get('/verify', verifyToken('dentist'), getDentist);
router.post('/logout', verifyToken('dentist'), dentistLogout);
router.get('/get-dentists', verifyToken('patient'), getAllDentists);
router.get('/pending', verifyToken('admin'), isAdmin, getPendingDentists);
router.get('/admin/all', verifyToken('admin'), isAdmin, getAllDentists);
router.put('/:dentistId/status', verifyToken('admin'), isAdmin, updateDentistStatus);
router.delete('/admin/:dentistId', verifyToken('admin'), isAdmin, deleteDentist);

module.exports = router;