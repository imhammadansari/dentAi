const express = require("express");
const {
    bookSlot, getSingleDentistSlots, updatePatientStatus, getDentistPatients,
    getSinglePatientBookings, getTodaySchedule, getDentistAllBookings,
    getDentistSlotBookings, getPatientConsultations
} = require("../controllers/bookingController");
const { verifyToken } = require("../middlewares/verifyToken");
const router = express.Router();

router.post("/book-slot", verifyToken('patient'), bookSlot);
router.get("/dentist-slots/:dentistId", verifyToken('patient'), getSingleDentistSlots);
router.get("/dentist-slot-bookings/:dentistId", verifyToken('dentist'), getDentistSlotBookings);
router.get("/dentist-patients", verifyToken('dentist'), getDentistPatients);
router.put("/update-status/:bookingId", verifyToken('dentist'), updatePatientStatus);
router.get("/patient-bookings/:patientId", verifyToken('dentist'), getSinglePatientBookings);
router.get("/today-schedule", verifyToken('dentist'), getTodaySchedule);
router.get("/dentist-all-bookings", verifyToken('dentist'), getDentistAllBookings);
router.get("/my-consultations", verifyToken('patient'), getPatientConsultations);

module.exports = router;