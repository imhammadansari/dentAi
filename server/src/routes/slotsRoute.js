const express = require('express');
const { addSlots, getAllSlots, getDentistsSlots } = require('../controllers/dentistSlotsController');
const { verifyToken } = require('../middlewares/verifyToken');
const router = express.Router();

router.post('/add-slot', verifyToken, addSlots);
router.get('/get-slots', verifyToken, getAllSlots);
router.get('/dentist-slots', verifyToken, getDentistsSlots);

module.exports = router