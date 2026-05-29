const express = require("express");
const multer = require("multer");
const { getAblyToken, getOrCreateChat, saveMessage, uploadChatFile, endChat, getChatStatus } = require("../controllers/chatController");
const { verifyToken } = require("../middlewares/verifyToken");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.get("/token", verifyToken, getAblyToken);
router.get("/:bookingId", verifyToken, getOrCreateChat);
router.get("/:bookingId/status", verifyToken, getChatStatus);
router.post("/:bookingId/message", verifyToken, saveMessage);
router.post("/:bookingId/upload", verifyToken, upload.single("file"), uploadChatFile);
router.post("/:bookingId/end", verifyToken, endChat);

module.exports = router;