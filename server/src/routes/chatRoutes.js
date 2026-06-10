const express = require("express");
const multer = require("multer");
const {
    getAblyToken, getOrCreateChat, saveMessage,
    uploadChatFile, endChat, getChatStatus, autoCompleteBookings
} = require("../controllers/chatController");
const { verifyToken } = require("../middlewares/verifyToken");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.get("/token", verifyToken, getAblyToken);

// Auto-complete past bookings (called on app load by any logged-in user)
router.post("/auto-complete-bookings", verifyToken, autoCompleteBookings);

// Order matters — specific routes before /:bookingId
router.get("/:bookingId/status", verifyToken, getChatStatus);
router.get("/:bookingId", verifyToken, getOrCreateChat);
router.post("/:bookingId/message", verifyToken, saveMessage);
router.post("/:bookingId/upload", verifyToken, upload.single("file"), uploadChatFile);
router.post("/:bookingId/end", verifyToken, endChat);

module.exports = router;