const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bookings",
        required: true,
        unique: true
    },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patients", required: true },
    dentistId: { type: mongoose.Schema.Types.ObjectId, ref: "Dentists", required: true },
    messages: [
        {
            senderId: { type: String, required: true },
            senderName: { type: String, required: true },
            senderRole: { type: String, enum: ["patient", "dentist"], required: true },
            text: { type: String, default: "" },
            fileUrl: { type: String, default: null },
            fileName: { type: String, default: null },
            fileType: { type: String, default: null },
            timestamp: { type: Date, default: Date.now }
        }
    ],
    status: { type: String, enum: ["active", "ended"], default: "active" },
    endedBy: { type: String, default: null },
    endedAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Chat", chatSchema);