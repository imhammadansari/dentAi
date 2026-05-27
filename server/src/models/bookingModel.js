const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patients",
        required: true
    },
    dentistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dentists",
        required: true
    },
    slotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Slots",
        required: true
    },
    date: String,
    start: String,
    end: String,
    review: String,
    status: {
        type: String,
        default: "Booked"
    }
});

module.exports = mongoose.model("Bookings", bookingSchema);