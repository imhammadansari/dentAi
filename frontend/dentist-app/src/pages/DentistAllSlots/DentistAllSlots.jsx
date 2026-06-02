import React, { useEffect, useState } from "react";
import axios from "axios";
import { TrashIcon, CalendarDaysIcon, ClockIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const DentistAllSlots = () => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    const fetchSlots = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/api/slots/dentist-slots`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSlots(response.data.data || []);
        } catch (error) {
            console.log(error.message);
            toast.error("Failed to fetch slots");
        } finally {
            setLoading(false);
        }
    };

    const deleteSlot = async (id) => {
        if (!window.confirm("Are you sure you want to delete this slot?")) return;

        setDeletingId(id);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(
                `${import.meta.env.VITE_SERVER_URL}/api/slots/delete-slot/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200) {
                toast.success("Slot deleted successfully");
                setSlots(prev => prev.filter(s => s.id !== id));
            }
        } catch (error) {
            toast.error(error.response?.data || "Failed to delete slot");
            console.log(error.message);
        } finally {
            setDeletingId(null);
        }
    };

    useEffect(() => {
        fetchSlots();
    }, []);

    // Group slots by date
    const groupedSlots = slots.reduce((acc, slot) => {
        const dateKey = new Date(slot.date).toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(slot);
        return acc;
    }, {});

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="p-2 lg:p-4 min-h-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-black">My Slots</h2>
                    <p className="text-emerald-600">View and manage all your time slots</p>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                    {slots.length} total slot{slots.length !== 1 ? 's' : ''}
                </span>
            </div>

            {loading ? (
                <div className="text-center py-12 text-emerald-600">Loading slots...</div>
            ) : slots.length === 0 ? (
                <div className="bg-white rounded-2xl border border-emerald-100 p-12 text-center shadow-sm">
                    <CalendarDaysIcon className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
                    <p className="text-emerald-600 font-medium">No slots added yet</p>
                    <p className="text-emerald-400 text-sm mt-1">Go to Add Slots to schedule your availability</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(groupedSlots).map(([dateLabel, dateSlots]) => {
                        const rawDate = new Date(dateSlots[0].date).toISOString().split('T')[0];
                        const isPast = rawDate < today;
                        const isToday = rawDate === today;

                        return (
                            <div key={dateLabel} className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
                                <div className={`px-4 py-3 flex items-center justify-between ${
                                    isToday ? 'bg-emerald-500' : isPast ? 'bg-gray-100' : 'bg-emerald-50'
                                }`}>
                                    <div className="flex items-center gap-2">
                                        <CalendarDaysIcon className={`w-4 h-4 ${isToday ? 'text-white' : 'text-emerald-600'}`} />
                                        <span className={`font-semibold text-sm ${isToday ? 'text-white' : isPast ? 'text-gray-500' : 'text-emerald-800'}`}>
                                            {dateLabel}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isToday && (
                                            <span className="px-2 py-0.5 bg-white/20 text-white text-xs rounded-full font-medium">Today</span>
                                        )}
                                        {isPast && (
                                            <span className="px-2 py-0.5 bg-gray-200 text-gray-500 text-xs rounded-full font-medium">Past</span>
                                        )}
                                        <span className={`text-xs ${isToday ? 'text-emerald-100' : 'text-emerald-500'}`}>
                                            {dateSlots.length} slot{dateSlots.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {dateSlots.map((slot) => (
                                        <div
                                            key={slot.id}
                                            className={`flex items-center justify-between p-3 rounded-xl border ${
                                                isPast
                                                    ? 'bg-gray-50 border-gray-200'
                                                    : 'bg-emerald-50 border-emerald-100'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <ClockIcon className={`w-4 h-4 flex-shrink-0 ${isPast ? 'text-gray-400' : 'text-emerald-500'}`} />
                                                <div>
                                                    <p className={`text-sm font-semibold ${isPast ? 'text-gray-500' : 'text-emerald-800'}`}>
                                                        {slot.start}
                                                    </p>
                                                    <p className={`text-xs ${isPast ? 'text-gray-400' : 'text-emerald-500'}`}>
                                                        to {slot.end}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => deleteSlot(slot.id)}
                                                disabled={deletingId === slot.id}
                                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors disabled:opacity-50"
                                                title="Delete slot"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default DentistAllSlots;