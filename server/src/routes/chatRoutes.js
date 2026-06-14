const express = require("express");
const multer = require("multer");
const {
    getAblyToken, getOrCreateChat, saveMessage,
    uploadChatFile, endChat, getChatStatus, autoCompleteBookings
} = require("../controllers/chatController");
const { verifyToken, verifyAnyToken } = require("../middlewares/verifyToken");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });


router.get("/token", verifyAnyToken, getAblyToken);
router.post("/auto-complete-bookings", verifyAnyToken, autoCompleteBookings);
router.get("/:bookingId/status", verifyAnyToken, getChatStatus);
router.get("/:bookingId", verifyAnyToken, getOrCreateChat);
router.post("/:bookingId/message", verifyAnyToken, saveMessage);
router.post("/:bookingId/upload", verifyAnyToken, upload.single("file"), uploadChatFile);
router.post("/:bookingId/end", verifyAnyToken, endChat);

module.exports = router;