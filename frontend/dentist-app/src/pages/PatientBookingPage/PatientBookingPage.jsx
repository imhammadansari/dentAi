import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

const PatientBookingsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState("Booked");

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/api/bookings/patient-bookings/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setBookings(response.data.data || []);
        } catch (error) {
            console.log("fetchBookings error:", error.response?.data || error.message);
        }
    };

    useEffect(() => { fetchBookings(); }, []);

    const filteredBookings = bookings.filter(
        b => b.status?.toLowerCase() === activeTab.toLowerCase()
    );

    const patient = bookings[0]?.patientId;

    // Check if current time is within a booking's slot
    const isWithinAppointmentTime = (booking) => {
        const now = new Date();

        const today =
            now.getFullYear() +
            "-" +
            String(now.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(now.getDate()).padStart(2, "0");
        if (booking.date !== today) return false;
        const [sh, sm] = booking.start.split(":").map(Number);
        const [eh, em] = booking.end.split(":").map(Number);
        const start = new Date(); start.setHours(sh, sm, 0, 0);
        const end = new Date(); end.setHours(eh, em, 0, 0);
        return now >= start && now <= end;
    };

    return (
        <div className="max-w-5xl mx-auto p-4 space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-black">{patient?.name}</h2>
                <p className="text-emerald-600">{patient?.email}</p>
                {patient?.phone && <p className="text-emerald-600">{patient?.phone}</p>}
            </div>

            {/* Tabs */}
            <div className="flex gap-3">
                {["Booked", "Completed", "Cancelled"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 cursor-pointer rounded-lg border transition ${activeTab === tab
                                ? "bg-emerald-500 text-white border-emerald-500"
                                : "bg-white text-black border-emerald-200 hover:bg-emerald-50"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Bookings */}
            <div className="space-y-4">
                {filteredBookings.length === 0 ? (
                    <div className="text-center py-10 text-emerald-600 bg-white rounded-xl border border-emerald-100">
                        No {activeTab.toLowerCase()} appointments
                    </div>
                ) : filteredBookings.map((booking) => {
                    const withinTime = isWithinAppointmentTime(booking);
                    return (
                        <div
                            key={booking._id}
                            className="bg-white border border-emerald-100 rounded-xl p-4 hover:shadow-md transition"
                        >
                            <div className="flex justify-between items-center">
                                <div
                                    className="flex-1 cursor-pointer"
                                    onClick={() =>
                                        navigate(`/dentist-dashboard/booking/${booking._id}`, {
                                            state: {
                                                bookingId: booking._id,
                                                name: patient?.name,
                                                email: patient?.email,
                                                phone: patient?.phone,
                                                status: booking.status
                                            }
                                        })
                                    }
                                >
                                    <p className="font-semibold text-black">{booking.date}</p>
                                    <p className="text-sm text-emerald-600">{booking.start} – {booking.end}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    {/* Chat button — only for Booked */}
                                    {booking.status === "Booked" && (
                                        <button
                                            onClick={() => navigate(`/dentist-dashboard/chat/${booking._id}`)}
                                            className={`flex items-center cursor-pointer gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${withinTime
                                                    ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm"
                                                    : "bg-emerald-50 text-emerald-400 cursor-not-allowed"
                                                }`}
                                            title={withinTime ? "Open Chat" : "Chat only available during appointment time"}
                                            disabled={!withinTime}
                                        >
                                            <ChatBubbleLeftRightIcon className="w-4 h-4" />
                                            Chat
                                        </button>
                                    )}
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${booking.status === "Booked" ? "bg-amber-100 text-amber-700" :
                                            booking.status === "Completed" ? "bg-emerald-100 text-emerald-700" :
                                                "bg-red-100 text-red-600"
                                        }`}>
                                        {booking.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PatientBookingsPage;