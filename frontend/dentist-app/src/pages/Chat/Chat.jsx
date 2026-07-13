import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import * as Ably from "ably";
import toast from "react-hot-toast";
import {
    PaperAirplaneIcon, PaperClipIcon, XMarkIcon,
    ArrowLeftIcon, DocumentIcon, PhotoIcon
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";

const SERVER = import.meta.env.VITE_SERVER_URL;

// Detect the base path for navigation (patient vs dentist)
const getBasePath = (role) =>
    role === "dentist" ? "/dentist-dashboard" : "/patient-dashboard";

const Chat = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [chatData, setChatData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [chatEnded, setChatEnded] = useState(false);
    const [endedBy, setEndedBy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [endConfirm, setEndConfirm] = useState(false);

    const ablyRef = useRef(null);
    const channelRef = useRef(null);
    const bottomRef = useRef(null);
    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        let mounted = true;
        const init = async () => {
            try {
                const chatRes = await axios.get(`${SERVER}/api/chat/${bookingId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = chatRes.data.data;
                if (!mounted) return;
                setChatData(data);
                setMessages(data.messages || []);
                if (data.status === "ended") {
                    setChatEnded(true);
                    setEndedBy(data.endedBy);
                    setLoading(false);
                    return;
                }

                const ablyClient = new Ably.Realtime({
                    key: import.meta.env.VITE_ABLY_KEY,
                    clientId: user.id,
                });
                ablyRef.current = ablyClient;

                ablyClient.connection.on("connected", () => {
                    const channel = ablyClient.channels.get(`chat-${bookingId}`);
                    channelRef.current = channel;
                    channel.subscribe("message", (msg) => {
                        const newMsg = msg.data;
                        if (newMsg.senderId === user.id) return;
                        setMessages(prev => {
                            const exists = prev.some(m =>
                                m.senderId === newMsg.senderId &&
                                m.text === newMsg.text &&
                                Math.abs(new Date(m.timestamp) - new Date(newMsg.timestamp)) < 5000
                            );
                            return exists ? prev : [...prev, newMsg];
                        });
                    });
                    channel.subscribe("chat-ended", (msg) => {
                        setChatEnded(true);
                        setEndedBy(msg.data.endedBy);
                        toast("Chat has been ended", { icon: "🔚" });
                    });
                });

                ablyClient.connection.on("failed", () => toast.error("Realtime connection failed"));
            } catch (err) {
                toast.error("Failed to load chat");
            } finally {
                if (mounted) setLoading(false);
            }
        };
        init();
        return () => {
            mounted = false;
            channelRef.current?.unsubscribe();
            ablyRef.current?.close();
        };
    }, [bookingId]);

    const sendMessage = async () => {
        if (!text.trim() || sending || chatEnded) return;
        setSending(true);
        const payload = {
            senderId: user.id, senderName: user.name, senderRole: user.role,
            text: text.trim(), fileUrl: null, fileName: null, fileType: null,
        };
        setText("");
        // Reset textarea height
        if (textareaRef.current) textareaRef.current.style.height = "44px";
        const optimistic = { ...payload, timestamp: new Date().toISOString() };
        setMessages(prev => [...prev, optimistic]);
        try {
            await axios.post(`${SERVER}/api/chat/${bookingId}/message`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch {
            toast.error("Failed to send");
            setText(payload.text);
            setMessages(prev => prev.filter(m => m !== optimistic));
        } finally {
            setSending(false);
        }
    };

    const sendFile = async (file) => {
        if (!file || chatEnded) return;
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        try {
            const uploadRes = await axios.post(
                `${SERVER}/api/chat/${bookingId}/upload`, formData,
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
            );
            const { fileUrl, fileName, fileType } = uploadRes.data;
            const filePayload = {
                senderId: user.id, senderName: user.name, senderRole: user.role,
                text: "", fileUrl, fileName, fileType
            };
            const optimistic = { ...filePayload, timestamp: new Date().toISOString() };
            setMessages(prev => [...prev, optimistic]);
            await axios.post(`${SERVER}/api/chat/${bookingId}/message`, filePayload, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch {
            toast.error("Failed to send file");
        } finally {
            setUploading(false);
        }
    };

    const handleEndChat = async () => {
        try {
            await axios.post(`${SERVER}/api/chat/${bookingId}/end`, { endedBy: user.name },
                { headers: { Authorization: `Bearer ${token}` } });
            setChatEnded(true);
            setEndedBy(user.name);
            setEndConfirm(false);
            toast.success("Chat ended");
        } catch {
            toast.error("Failed to end chat");
        }
    };

    const handleKeyDown = (e) => {
        // On mobile (touch devices) Enter should insert newline, not send
        if (e.key === "Enter" && !e.shiftKey && window.innerWidth >= 768) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Auto-grow textarea
    const handleTextChange = (e) => {
        setText(e.target.value);
        const ta = e.target;
        ta.style.height = "44px";
        ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
    };

    const isImage = (type) => type?.startsWith("image/");
    const isPdf = (type) => type === "application/pdf" || type?.includes("pdf");

    // Google Docs Viewer — works around Cloudinary CORS for PDFs
    const openPdf = (url) => {
        const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=false`;
        window.open(viewerUrl, "_blank", "noopener,noreferrer");
    };

    const otherName = user?.role === "patient"
        ? `Dr. ${chatData?.booking?.dentistName || ""}`
        : (chatData?.booking?.patientName || "");

    const otherInitial = otherName?.charAt(0)?.toUpperCase() || "?";

    if (loading) {
        return (
            <div className="flex items-center justify-center bg-gray-50" style={{ height: "100dvh" }}>
                <div className="text-center px-4">
                    <div className="w-12 h-12 border-4 border-t-emerald-500 border-emerald-200 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 text-sm">Connecting to chat...</p>
                </div>
            </div>
        );
    }

    return (
        /* 100dvh accounts for mobile browser chrome (address bar) */
        <div className="flex flex-col bg-gray-50" style={{ height: "100dvh" }}>

            {/* ── Header ── */}
            <div className="bg-white border-b border-gray-100 px-3 py-2.5 flex items-center justify-between shadow-sm flex-shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                    <button
                        onClick={() => navigate(`${getBasePath(user?.role)}/consultations`)}
                        className="p-2 hover:bg-emerald-50 rounded-xl transition-colors flex-shrink-0"
                    >
                        <ArrowLeftIcon className="w-5 h-5 text-emerald-700" />
                    </button>
                    <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-green-400 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {otherInitial}
                    </div>
                    <div className="min-w-0">
                        <p className="font-bold text-gray-900 text-sm truncate">{otherName}</p>
                        <p className="text-xs text-emerald-500 truncate">
                            {chatData?.booking?.date} · {chatData?.booking?.start}–{chatData?.booking?.end}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    {chatEnded ? (
                        <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full whitespace-nowrap">
                            Ended
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Live
                        </span>
                    )}
                    {!chatEnded && (
                        <button
                            onClick={() => setEndConfirm(true)}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-medium transition-colors"
                        >
                            <XMarkIcon className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">End</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Ended banner */}
            {chatEnded && (
                <div className="bg-red-50 border-b border-red-200 px-3 py-2 text-center text-xs text-red-600 flex-shrink-0">
                    Chat ended by <strong>{endedBy}</strong> — history is read-only
                </div>
            )}

            {/* ── Messages ── */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 pb-10">
                        <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                            <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <p className="font-medium text-sm">No messages yet</p>
                        <p className="text-xs mt-1 text-gray-300">Say hello 👋</p>
                    </div>
                ) : (
                    messages.map((msg, i) => {
                        const isOwn = msg.senderId === user.id;
                        return (
                            <div key={i} className={`flex ${isOwn ? "justify-end" : "justify-start"} items-end gap-1.5`}>
                                {/* Other person avatar — only show when sender changes */}
                                {!isOwn && (
                                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mb-0.5">
                                        {otherInitial}
                                    </div>
                                )}

                                <div className={`max-w-[78%] sm:max-w-[65%] flex flex-col gap-0.5 ${isOwn ? "items-end" : "items-start"}`}>
                                    <div className={`rounded-2xl px-3 py-2 ${isOwn
                                            ? "bg-gradient-to-br from-emerald-500 to-green-400 text-white rounded-br-sm"
                                            : "bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-sm"
                                        }`}>
                                        {msg.fileUrl && (
                                            <>
                                                {isImage(msg.fileType) ? (
                                                    <img
                                                        src={msg.fileUrl}
                                                        alt={msg.fileName}
                                                        className="max-w-full rounded-xl max-h-52 object-cover cursor-pointer"
                                                        onClick={() => window.open(msg.fileUrl, "_blank")}
                                                    />
                                                ) : isPdf(msg.fileType) ? (
                                                    <button
                                                        onClick={() => openPdf(msg.fileUrl)}
                                                        className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-sm font-medium w-full text-left transition-colors
                                                            ${isOwn
                                                                ? "bg-white/20 hover:bg-white/30 text-white"
                                                                : "bg-red-50 hover:bg-red-100 text-red-700 border border-red-200"
                                                            }`}
                                                    >
                                                        <DocumentIcon className="w-5 h-5 flex-shrink-0" />
                                                        <span className="truncate text-xs">{msg.fileName || "View PDF"}</span>
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase flex-shrink-0
                                                            ${isOwn ? "bg-white/30 text-white" : "bg-red-200 text-red-700"}`}>
                                                            PDF
                                                        </span>
                                                    </button>
                                                ) : (
                                                    <a
                                                        href={msg.fileUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className={`flex items-center gap-1.5 text-xs underline ${isOwn ? "text-white/90" : "text-emerald-600"}`}
                                                    >
                                                        <PaperClipIcon className="w-4 h-4 flex-shrink-0" />
                                                        <span className="truncate">{msg.fileName || "View File"}</span>
                                                    </a>
                                                )}
                                            </>
                                        )}
                                        {msg.text && (
                                            <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                                                {msg.text}
                                            </p>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-gray-400 px-1">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={bottomRef} />
            </div>

            {/* ── Input ── */}
            {!chatEnded ? (
                <div className="bg-white border-t border-gray-100 px-3 py-2.5 flex-shrink-0 safe-area-bottom">
                    <div className="flex items-end gap-2">
                        {/* File attach */}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition-colors flex-shrink-0 disabled:opacity-40 active:scale-95"
                            title="Attach file"
                        >
                            {uploading
                                ? <div className="w-5 h-5 border-2 border-t-emerald-500 border-emerald-200 rounded-full animate-spin" />
                                : <PaperClipIcon className="w-5 h-5" />
                            }
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept="image/*,.pdf,.doc,.docx,.txt"
                            onChange={e => { if (e.target.files[0]) sendFile(e.target.files[0]); e.target.value = ""; }}
                        />

                        {/* Text input */}
                        <textarea
                            ref={textareaRef}
                            value={text}
                            onChange={handleTextChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Message..."
                            rows={1}
                            className="flex-1 resize-none bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent text-sm leading-relaxed"
                            style={{ height: "44px", maxHeight: "120px" }}
                        />

                        {/* Send */}
                        <button
                            onClick={sendMessage}
                            disabled={!text.trim() || sending}
                            className="p-2.5 bg-gradient-to-br from-emerald-500 to-green-400 text-white rounded-xl transition-all disabled:opacity-40 flex-shrink-0 active:scale-95 shadow-sm shadow-emerald-200"
                        >
                            {sending
                                ? <div className="w-5 h-5 border-2 border-t-white border-white/40 rounded-full animate-spin" />
                                : <PaperAirplaneIcon className="w-5 h-5" />
                            }
                        </button>
                    </div>

                    {/* Mobile send hint */}
                    <p className="text-[10px] text-gray-300 text-center mt-1 md:hidden">
                        Tap the arrow to send
                    </p>
                </div>
            ) : (
                <div className="bg-white border-t border-red-100 px-4 py-3 text-center flex-shrink-0">
                    <p className="text-sm text-red-500 font-medium mb-2">This chat has ended</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors active:scale-95"
                    >
                        Go Back
                    </button>
                </div>
            )}

            {/* ── End Chat Confirm Modal ── */}
            {endConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-2xl">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <XMarkIcon className="w-6 h-6 text-red-500" />
                        </div>
                        <h3 className="text-center text-base font-bold text-gray-900 mb-1">End this chat?</h3>
                        <p className="text-center text-sm text-gray-500 mb-5">
                            Both you and <strong>{otherName}</strong> will lose the ability to send messages. This also marks the consultation as Completed.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setEndConfirm(false)}
                                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEndChat}
                                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors active:scale-95"
                            >
                                End Chat
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;