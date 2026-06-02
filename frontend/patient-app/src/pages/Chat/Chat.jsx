import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import * as Ably from "ably";
import toast from "react-hot-toast";
import {
    PaperAirplaneIcon, PaperClipIcon, XMarkIcon,
    ArrowLeftIcon, PhoneIcon
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";

const SERVER = import.meta.env.VITE_SERVER_URL;

const Chat = () => {
    const { bookingId } = useParams();
    const { state } = useLocation();
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
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");

    // Scroll to bottom whenever messages change
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Initialise Ably and load chat
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
                }

                // const ablyClient = new Ably.Realtime({
                //     authUrl: `${SERVER}/api/chat/token?token=${encodeURIComponent(token)}`,
                //     authMethod: "GET",
                //     clientId: user.id,
                // });

                const ablyClient = new Ably.Realtime({
                    key: import.meta.env.VITE_ABLY_KEY,
                    clientId: user.id,
                });

                ablyRef.current = ablyClient;

                ablyClient.connection.on("connected", () => {
                    console.log("Ably connected ✅");
                    const channel = ablyClient.channels.get(`chat-${bookingId}`);
                    channelRef.current = channel;

                    channel.subscribe("message", (msg) => {
                        const newMsg = msg.data;
                        setMessages(prev => {
                            // Deduplicate: skip if a message from same sender
                            // with same text already exists within 5 seconds
                            const exists = prev.some(
                                m =>
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

                ablyClient.connection.on("failed", (err) => {
                    console.error("Ably connection FAILED ❌", err);
                    toast.error("Realtime connection failed");
                });

                ablyClient.connection.on("disconnected", (err) => {
                    console.warn("Ably disconnected", err);
                });

            } catch (err) {
                console.error(err.message);
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
            senderId: user.id,
            senderName: user.name,
            senderRole: user.role,
            text: text.trim(),
            fileUrl: null,
            fileName: null,
            fileType: null,
        };

        setText("");

        // Optimistically add message to UI immediately
        const optimisticMsg = { ...payload, timestamp: new Date().toISOString() };
        setMessages(prev => [...prev, optimisticMsg]);

        try {
            await axios.post(`${SERVER}/api/chat/${bookingId}/message`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) {
            toast.error("Failed to send message");
            setText(payload.text);
            // Remove optimistic message on failure
            setMessages(prev => prev.filter(m => m !== optimisticMsg));
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
                `${SERVER}/api/chat/${bookingId}/upload`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            const { fileUrl, fileName, fileType } = uploadRes.data;

            const filePayload = {
                senderId: user.id,
                senderName: user.name,
                senderRole: user.role,
                text: "",
                fileUrl, fileName, fileType
            };

            // Optimistically add file message
            const optimisticFile = { ...filePayload, timestamp: new Date().toISOString() };
            setMessages(prev => [...prev, optimisticFile]);

            await axios.post(`${SERVER}/api/chat/${bookingId}/message`, filePayload, {
                headers: { Authorization: `Bearer ${token}` }
            });

        } catch (err) {
            toast.error("Failed to send file");
        } finally {
            setUploading(false);
        }
    };

    const handleEndChat = async () => {
        try {
            await axios.post(`${SERVER}/api/chat/${bookingId}/end`, {
                endedBy: user.name
            }, { headers: { Authorization: `Bearer ${token}` } });
            setChatEnded(true);
            setEndedBy(user.name);
            setEndConfirm(false);
        } catch (err) {
            toast.error("Failed to end chat");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const isImage = (type) => type?.startsWith("image/");

    const canSend = !chatEnded && !uploading && !sending;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-t-emerald-500 border-emerald-200 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Connecting to chat...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-emerald-100 px-4 py-3 flex items-center justify-between shadow-sm flex-shrink-0">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                        <ArrowLeftIcon className="w-5 h-5 text-emerald-700" />
                    </button>
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-400 rounded-full flex items-center justify-center text-white font-bold">
                        {(user.role === "patient"
                            ? chatData?.booking?.dentistName
                            : chatData?.booking?.patientName
                        )?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900">
                            {user.role === "patient"
                                ? `Dr. ${chatData?.booking?.dentistName}`
                                : chatData?.booking?.patientName}
                        </p>
                        <p className="text-xs text-emerald-600">
                            {chatData?.booking?.date} · {chatData?.booking?.start} – {chatData?.booking?.end}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {chatEnded ? (
                        <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
                            Chat Ended
                        </span>
                    ) : (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Live
                        </span>
                    )}

                    {!chatEnded && (
                        <button
                            onClick={() => setEndConfirm(true)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
                        >
                            <XMarkIcon className="w-4 h-4" />
                            End Chat
                        </button>
                    )}
                </div>
            </div>

            {chatEnded && (
                <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-center text-sm text-red-600">
                    This chat was ended by <strong>{endedBy}</strong>. You can still view the history above.
                </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 pt-10">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                            <PhoneIcon className="w-8 h-8 text-emerald-400" />
                        </div>
                        <p className="font-medium text-gray-500">No messages yet</p>
                        <p className="text-sm mt-1">Messages will appear here during your appointment</p>
                    </div>
                )}

                {messages.map((msg, i) => {
                    const isOwn = msg.senderId === user.id;
                    return (
                        <div key={i} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[75%] ${isOwn ? "items-end" : "items-start"} flex flex-col gap-1`}>
                                {!isOwn && (
                                    <p className="text-xs text-gray-400 ml-1">{msg.senderName}</p>
                                )}
                                <div className={`rounded-2xl px-4 py-2.5 shadow-sm ${isOwn
                                    ? "bg-gradient-to-br from-emerald-500 to-green-400 text-white rounded-tr-sm"
                                    : "bg-white text-gray-800 border border-gray-100 rounded-tl-sm"
                                    }`}>
                                    {msg.fileUrl && (
                                        <div>
                                            {isImage(msg.fileType) ? (
                                                <img
                                                    src={msg.fileUrl}
                                                    alt={msg.fileName}
                                                    className="max-w-full rounded-lg max-h-48 object-cover cursor-pointer"
                                                    onClick={() => window.open(msg.fileUrl, "_blank")}
                                                />
                                            ) : (
                                                <a
                                                    href={msg.fileUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className={`flex items-center gap-2 text-sm underline ${isOwn ? "text-white" : "text-emerald-600"}`}
                                                >
                                                    <PaperClipIcon className="w-4 h-4 flex-shrink-0" />
                                                    {msg.fileName || "View File"}
                                                </a>
                                            )}
                                        </div>
                                    )}
                                    {msg.text && (
                                        <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                                    )}
                                </div>
                                <p className={`text-[10px] text-gray-400 ${isOwn ? "text-right" : "text-left"} px-1`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            {!chatEnded && (
                <div className="bg-white border-t border-emerald-100 px-4 py-3 flex-shrink-0">
                    <div className="flex items-end gap-2">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={!canSend}
                            className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition-colors flex-shrink-0 disabled:opacity-40"
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

                        <textarea
                            value={text}
                            onChange={e => setText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message... (Enter to send)"
                            rows={1}
                            disabled={!canSend}
                            className="flex-1 resize-none bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm disabled:opacity-50"
                            style={{ maxHeight: "120px" }}
                        />

                        <button
                            onClick={sendMessage}
                            disabled={!canSend || !text.trim()}
                            className="p-3 bg-gradient-to-br from-emerald-500 to-green-400 text-white rounded-xl hover:shadow-md hover:shadow-emerald-200 transition-all disabled:opacity-40 flex-shrink-0"
                        >
                            <PaperAirplaneIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {chatEnded && (
                <div className="bg-white border-t border-red-100 px-4 py-4 text-center flex-shrink-0">
                    <p className="text-sm text-red-500 font-medium">This chat has ended</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-2 px-6 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            )}

            {/* End Confirm Dialog */}
            {endConfirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <XMarkIcon className="w-6 h-6 text-red-500" />
                        </div>
                        <h3 className="text-center text-lg font-bold text-gray-900 mb-2">End Chat?</h3>
                        <p className="text-center text-sm text-gray-500 mb-6">
                            This will permanently end the chat for both you and{" "}
                            {user.role === "patient"
                                ? `Dr. ${chatData?.booking?.dentistName}`
                                : chatData?.booking?.patientName}.
                            This cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setEndConfirm(false)}
                                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEndChat}
                                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
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