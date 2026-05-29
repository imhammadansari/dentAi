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
router.get('/verify', verifyToken, getDentist);
router.post('/logout', verifyToken, dentistLogout);
router.get('/get-dentists', verifyToken, getAllDentists);
router.get('/pending', verifyToken, isAdmin, getPendingDentists);
router.get('/admin/all', verifyToken, isAdmin, getAllDentists);
router.put('/:dentistId/status', verifyToken, isAdmin, updateDentistStatus);
router.delete('/admin/:dentistId', verifyToken, isAdmin, deleteDentist);

module.exports = router;