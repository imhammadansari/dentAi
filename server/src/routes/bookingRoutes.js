const express = require("express");
const { bookSlot, getSingleDentistSlots, updatePatientStatus, getDentistPatients, getSinglePatientBookings } = require("../controllers/bookingController");
const { verifyToken } = require("../middlewares/verifyToken");
const router = express.Router();


router.post("/book-slot", verifyToken, bookSlot);
router.get("/dentist-slots/:dentistId", verifyToken, getSingleDentistSlots);
router.get("/dentist-patients", verifyToken, getDentistPatients);
router.put(
    "/update-status/:bookingId",
    verifyToken,
    updatePatientStatus
);
router.get(
    "/patient-bookings/:patientId",
    verifyToken,
    getSinglePatientBookings
);

module.exports = router;