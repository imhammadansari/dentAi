const Ably = require("ably");
const chatModel = require("../models/chatModel");
const bookingModel = require("../models/bookingModel");
const cloudinary = require("../config/cloudinary");

let ably;
const getAbly = () => {
    if (!ably) {
        ably = new Ably.Rest({ key: process.env.ABLY_API_KEY });
    }
    return ably;
};

// Generate an Ably token for the client
const getAblyToken = async (req, res) => {
    try {
        const tokenParams = {
            clientId: req.user.id.toString(),
            capability: { "*": ["subscribe", "publish", "presence"] },
            ttl: 24 * 60 * 60 * 1000,
        };
        const tokenRequest = await getAbly().auth.createTokenRequest(tokenParams);
        res.json(tokenRequest);
    } catch (err) {
        console.error("getAblyToken error:", err.message);
        res.status(500).json({ message: err.message });
    }
};

// Get or create a chat session for a booking
const getOrCreateChat = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const booking = await bookingModel.findById(bookingId)
            .populate("patientId", "name")
            .populate("dentistId", "name");

        if (!booking) return res.status(404).json({ message: "Booking not found" });
        if (booking.status !== "Booked") return res.status(400).json({ message: "Chat only available for Booked appointments" });

        let chat = await chatModel.findOne({ bookingId });
        if (!chat) {
            chat = await chatModel.create({
                bookingId,
                patientId: booking.patientId._id,
                dentistId: booking.dentistId._id,
            });
        }

        res.json({
            success: true,
            data: {
                chatId: chat._id,
                bookingId,
                channelName: `chat-${bookingId}`,
                messages: chat.messages,
                status: chat.status,
                endedBy: chat.endedBy,
                booking: {
                    date: booking.date,
                    start: booking.start,
                    end: booking.end,
                    patientName: booking.patientId?.name,
                    dentistName: booking.dentistId?.name,
                }
            }
        });
    } catch (err) {
        console.error("getOrCreateChat error:", err.message);
        res.status(500).json({ message: err.message });
    }
};

// Save a message to the DB
const saveMessage = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { senderId, senderName, senderRole, text, fileUrl, fileName, fileType } = req.body;

        const chat = await chatModel.findOne({ bookingId });
        if (!chat) return res.status(404).json({ message: "Chat not found" });
        if (chat.status === "ended") return res.status(400).json({ message: "Chat has ended" });

        const message = {
            senderId,
            senderName,
            senderRole: senderRole?.toLowerCase(),
            text,
            fileUrl,
            fileName,
            fileType,
            timestamp: new Date()
        };
        chat.messages.push(message);
        await chat.save();

        try {
            const channel = getAbly().channels.get(`chat-${bookingId}`);
            await channel.publish("message", message);
        } catch (ablyErr) {
            console.error("Ably publish error:", ablyErr.message);
        }

        res.json({ success: true, data: message });
    } catch (err) {
        console.error("saveMessage error:", err.message);
        res.status(500).json({ message: err.message });
    }
};

// Upload a file for chat
const uploadChatFile = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "chat_files", resource_type: "auto" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            stream.end(req.file.buffer);
        });

        res.json({
            success: true,
            fileUrl: result.secure_url,
            fileName: req.file.originalname,
            fileType: req.file.mimetype,
        });
    } catch (err) {
        console.error("uploadChatFile error:", err.message);
        res.status(500).json({ message: err.message });
    }
};

// End a chat
const endChat = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { endedBy } = req.body;

        const chat = await chatModel.findOne({ bookingId });
        if (!chat) return res.status(404).json({ message: "Chat not found" });

        chat.status = "ended";
        chat.endedBy = endedBy;
        chat.endedAt = new Date();
        await chat.save();

        try {
            const channel = getAbly().channels.get(`chat-${bookingId}`);
            await channel.publish("chat-ended", { endedBy, endedAt: chat.endedAt });
        } catch (ablyErr) {
            console.error("Ably publish error:", ablyErr.message);
        }

        res.json({ success: true, message: "Chat ended" });
    } catch (err) {
        console.error("endChat error:", err.message);
        res.status(500).json({ message: err.message });
    }
};

// Check if chat is active for a booking
const getChatStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const chat = await chatModel.findOne({ bookingId });
        res.json({
            success: true,
            exists: !!chat,
            status: chat?.status || null,
            endedBy: chat?.endedBy || null
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAblyToken, getOrCreateChat, saveMessage, uploadChatFile, endChat, getChatStatus };