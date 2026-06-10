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
// Allows both "Booked" and "Completed" bookings to access chat
const getOrCreateChat = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const booking = await bookingModel.findById(bookingId)
            .populate("patientId", "name")
            .populate("dentistId", "name");

        if (!booking) return res.status(404).json({ message: "Booking not found" });

        const allowedStatuses = ["Booked", "Completed", "booked", "completed"];
        if (!allowedStatuses.includes(booking.status)) {
            return res.status(400).json({ message: "Chat not available for this booking" });
        }

        let chat = await chatModel.findOne({ bookingId });
        if (!chat) {
            if (booking.status?.toLowerCase() !== "booked") {
                return res.status(404).json({ message: "No chat found for this consultation" });
            }
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
// PDFs uploaded as raw resource type so they get a proper downloadable/viewable URL
const uploadChatFile = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        const isPdf = req.file.mimetype === "application/pdf";

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "chat_files",
                    resource_type: isPdf ? "raw" : "auto",
                    ...(isPdf && { access_mode: "public" })
                },
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

// End a chat — also marks the associated booking as Completed
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

        // Auto-complete the booking when chat is ended
        await bookingModel.findByIdAndUpdate(bookingId, { status: "Completed" });

        try {
            const channel = getAbly().channels.get(`chat-${bookingId}`);
            await channel.publish("chat-ended", { endedBy, endedAt: chat.endedAt });
        } catch (ablyErr) {
            console.error("Ably publish error:", ablyErr.message);
        }

        res.json({ success: true, message: "Chat ended and booking marked as Completed" });
    } catch (err) {
        console.error("endChat error:", err.message);
        res.status(500).json({ message: err.message });
    }
};

// Check if chat exists for a booking
const getChatStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const chat = await chatModel.findOne({ bookingId });
        res.json({
            success: true,
            exists: !!chat,
            hasMessages: chat ? chat.messages.length > 0 : false,
            status: chat?.status || null,
            endedBy: chat?.endedBy || null
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Auto-complete bookings whose slot time has passed.
// Handles both date formats in the DB: "M/D/YYYY" (old) and "YYYY-MM-DD" (new)
const autoCompleteBookings = async (req, res) => {
    try {
        const now = new Date();
        const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

        const booked = await bookingModel.find({ status: "Booked" });
        const toComplete = [];

        for (const b of booked) {
            const bookingDate = b.date;
            const bookingEnd = b.end;
            if (!bookingDate || !bookingEnd) continue;

            const parsed = new Date(bookingDate);
            if (isNaN(parsed.getTime())) continue;

            const bookingMidnight = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
            const isDatePast = bookingMidnight < todayMidnight;
            const isDateToday = bookingMidnight.getTime() === todayMidnight.getTime();
            const isTimePast = isDateToday && bookingEnd <= currentTime;

            if (isDatePast || isTimePast) {
                toComplete.push(b._id);
            }
        }

        if (toComplete.length > 0) {
            await bookingModel.updateMany(
                { _id: { $in: toComplete } },
                { $set: { status: "Completed" } }
            );
        }

        res.json({
            success: true,
            message: `${toComplete.length} booking(s) marked as Completed`,
            completedCount: toComplete.length
        });
    } catch (err) {
        console.error("autoCompleteBookings error:", err.message);
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAblyToken, getOrCreateChat, saveMessage, uploadChatFile,
    endChat, getChatStatus, autoCompleteBookings
};