const express = require('express');
const { addSlots, getAllSlots, getDentistsSlots, deleteSlot } = require('../controllers/dentistSlotsController');
const { verifyToken } = require('../middlewares/verifyToken');
const router = express.Router();

router.post('/add-slot', verifyToken, addSlots);
router.get('/get-slots', verifyToken, getAllSlots);
router.get('/dentist-slots', verifyToken, getDentistsSlots);
router.delete("/delete-slot/:id", verifyToken, deleteSlot);


module.exports = router