const express = require("express");
const { bookSlot, getSingleDentistSlots, updatePatientStatus, getDentistPatients, getSinglePatientBookings, getTodaySchedule, getDentistAllBookings, getDentistSlotBookings } = require("../controllers/bookingController");
const { verifyToken } = require("../middlewares/verifyToken");
const router = express.Router();


router.post("/book-slot", verifyToken, bookSlot);
router.get("/dentist-slots/:dentistId", verifyToken, getSingleDentistSlots);
router.get("/dentist-slot-bookings/:dentistId", verifyToken, getDentistSlotBookings);
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
router.get("/today-schedule", verifyToken, getTodaySchedule);
router.get("/dentist-all-bookings", verifyToken, getDentistAllBookings);

module.exports = router;