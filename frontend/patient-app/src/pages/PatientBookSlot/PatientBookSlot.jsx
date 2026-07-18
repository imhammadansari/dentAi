import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { CalendarDaysIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const BookSlot = () => {
    const { dentistId } = useParams();
    const [slots, setSlots] = useState([]);
    const [bookedSlotIds, setBookedSlotIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [bookingId, setBookingId] = useState(null);

    const toLocalDateString = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [slotsRes, bookingsRes] = await Promise.all([
                axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/api/bookings/dentist-slots/${dentistId}`,
                    { withCredentials: true }
                ),
                axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/api/bookings/dentist-slot-bookings/${dentistId}`,
                    { withCredentials: true }
                )
            ]);

            setSlots(slotsRes.data.data || []);

            const bookings = bookingsRes.data.data || [];
            const bookedIds = new Set(
                bookings
                    .filter(b => b.status?.toLowerCase() !== "cancelled")
                    .map(b => b.slotId?.toString())
            );
            setBookedSlotIds(bookedIds);
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [dentistId]);

    const bookSlot = async (slotId) => {
        if (!window.confirm("Are you sure you want to book this slot?")) return;
        setBookingId(slotId);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/bookings/book-slot`,
                { slotId },
                { withCredentials: true }
            );
            if (response.status === 200) {
                toast.success("Appointment booked successfully!");
                setBookedSlotIds(prev => new Set([...prev, slotId]));
            }
        } catch (error) {
            toast.error(error.response?.data || error.message);
        } finally {
            setBookingId(null);
        }
    };

    const now = new Date();
    const todayStr = toLocalDateString(now);
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Filter out slots where end time has already passed
    const isSlotExpired = (slot) => {
        const slotDate = new Date(slot.date).toISOString().split('T')[0];
        if (slotDate < todayStr) return true;
        if (slotDate === todayStr && slot.end <= currentTime) return true;
        return false;
    };

    const activeSlots = slots.filter(slot => !isSlotExpired(slot));

    const groupedSlots = activeSlots.reduce((acc, slot) => {
        const dateKey = new Date(slot.date).toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(slot);
        return acc;
    }, {});

    const upcomingGroups = Object.entries(groupedSlots);

    return (
        <div className="p-3 lg:p-4 w-full mx-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-black">Available Slots</h2>
                <p className="text-emerald-600 mt-1">Select a slot to book your appointment</p>
            </div>

            {loading ? (
                <div className="text-center py-12 text-emerald-600">Loading available slots...</div>
            ) : upcomingGroups.length === 0 ? (
                <div className="bg-white rounded-2xl border border-emerald-100 p-12 text-center shadow-sm">
                    <CalendarDaysIcon className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
                    <p className="text-emerald-600 font-medium">No upcoming slots available</p>
                    <p className="text-emerald-400 text-sm mt-1">Check back later for new availability</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {upcomingGroups.map(([dateLabel, dateSlots]) => {
                        const isToday = new Date(dateSlots[0].date).toISOString().split('T')[0] === todayStr;
                        return (
                            <div key={dateLabel} className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
                                <div className={`px-4 py-3 flex items-center gap-2 ${isToday ? 'bg-emerald-500' : 'bg-emerald-50'}`}>
                                    <CalendarDaysIcon className={`w-4 h-4 ${isToday ? 'text-white' : 'text-emerald-600'}`} />
                                    <span className={`font-semibold text-sm ${isToday ? 'text-white' : 'text-emerald-800'}`}>
                                        {dateLabel}
                                    </span>
                                    {isToday && (
                                        <span className="ml-auto px-2 py-0.5 bg-white/20 text-white text-xs rounded-full font-medium">Today</span>
                                    )}
                                </div>

                                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {dateSlots.map((slot) => {
                                        const slotId = slot._id || slot.id;
                                        const isFull = bookedSlotIds.has(slotId?.toString());
                                        const isBooking = bookingId === slotId;

                                        return (
                                            <div
                                                key={slotId}
                                                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isFull ? 'bg-gray-50 border-gray-200' : 'bg-emerald-50 border-emerald-100 hover:border-emerald-300'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isFull ? 'bg-gray-200' : 'bg-emerald-100'}`}>
                                                        <ClockIcon className={`w-5 h-5 ${isFull ? 'text-gray-400' : 'text-emerald-600'}`} />
                                                    </div>
                                                    <div>
                                                        <p className={`font-semibold ${isFull ? 'text-gray-500' : 'text-emerald-900'}`}>
                                                            {slot.start} – {slot.end}
                                                        </p>
                                                        {isFull && <p className="text-xs text-red-400 font-medium mt-0.5">Fully Booked</p>}
                                                    </div>
                                                </div>

                                                {isFull ? (
                                                    <span className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-400 rounded-lg text-sm font-medium border border-red-100">
                                                        <XCircleIcon className="w-4 h-4" />
                                                        Full
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() => bookSlot(slotId)}
                                                        disabled={isBooking}
                                                        className="flex cursor-pointer items-center gap-1 px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                                                    >
                                                        {isBooking ? 'Booking...' : (
                                                            <>
                                                                <CheckCircleIcon className="w-4 h-4" />
                                                                Book
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default BookSlot;