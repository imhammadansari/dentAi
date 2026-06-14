const express = require('express');
const { addSlots, getAllSlots, getDentistsSlots, deleteSlot } = require('../controllers/dentistSlotsController');
const { verifyToken } = require('../middlewares/verifyToken');
const router = express.Router();

router.post('/add-slot', verifyToken('dentist'), addSlots);
router.get('/get-slots', verifyToken('patient'), getAllSlots);
router.get('/dentist-slots', verifyToken('dentist'), getDentistsSlots);
router.delete("/delete-slot/:id", verifyToken('dentist'), deleteSlot);

module.exports = router;