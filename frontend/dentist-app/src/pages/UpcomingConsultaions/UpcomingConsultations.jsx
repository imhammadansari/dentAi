import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    CalendarDaysIcon,
    ChatBubbleLeftRightIcon,
    ClockIcon,
    UserIcon,
    MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

const SERVER = import.meta.env.VITE_SERVER_URL;

const UpcomingConsultations = () => {
    const navigate = useNavigate();
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchConsultations = async () => {
            try {
                const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
                const res = await axios.get(`${SERVER}/api/bookings/dentist-all-bookings`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Only show Booked status
                const booked = (res.data.data || []).filter(
                    b => b.status?.toLowerCase() === 'booked'
                );
                setConsultations(booked);
            } catch (err) {
                console.log('fetchConsultations error:', err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchConsultations();
    }, []);

    const isWithinAppointmentTime = (c) => {
        const now = new Date();
        const today =
            now.getFullYear() + '-' +
            String(now.getMonth() + 1).padStart(2, '0') + '-' +
            String(now.getDate()).padStart(2, '0');
        if (c.date !== today) return false;
        const [sh, sm] = c.start.split(':').map(Number);
        const [eh, em] = c.end.split(':').map(Number);
        const start = new Date(); start.setHours(sh, sm, 0, 0);
        const end = new Date(); end.setHours(eh, em, 0, 0);
        return now >= start && now <= end;
    };

    const filtered = consultations.filter(c => {
        const q = search.toLowerCase();
        return (
            c.patient?.name?.toLowerCase().includes(q) ||
            c.patient?.email?.toLowerCase().includes(q) ||
            c.date?.includes(q)
        );
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-emerald-900">Upcoming Consultations</h2>
                    <p className="text-emerald-600 text-sm mt-1">
                        {loading ? '...' : `${consultations.length} booked appointment${consultations.length !== 1 ? 's' : ''}`}
                    </p>
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-72">
                    <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email or date..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-emerald-200 bg-white text-sm text-emerald-900 placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    />
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-emerald-100 p-16 text-center">
                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <CalendarDaysIcon className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-emerald-900 mb-1">
                        {search ? 'No results found' : 'No upcoming consultations'}
                    </h3>
                    <p className="text-emerald-500 text-sm">
                        {search ? 'Try a different search term.' : 'New bookings will appear here.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(c => {
                        const withinTime = isWithinAppointmentTime(c);
                        return (
                            <div
                                key={c.id}
                                className="bg-white rounded-2xl border border-emerald-100 p-5 hover:shadow-md transition-all"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    {/* Avatar */}
                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-400 rounded-xl flex items-center justify-center shrink-0">
                                        <UserIcon className="w-6 h-6 text-white" />
                                    </div>

                                    {/* Patient info */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-emerald-900 text-base truncate">
                                            {c.patient?.name || 'Patient'}
                                        </h4>
                                        <p className="text-emerald-500 text-sm truncate">{c.patient?.email}</p>
                                        {c.patient?.phone && (
                                            <p className="text-emerald-500 text-sm">{c.patient.phone}</p>
                                        )}
                                    </div>

                                    {/* Date & time */}
                                    <div className="flex items-center gap-4 text-sm text-emerald-700 shrink-0">
                                        <div className="flex items-center gap-1.5">
                                            <CalendarDaysIcon className="w-4 h-4 text-emerald-400" />
                                            <span className="font-medium">{c.date}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <ClockIcon className="w-4 h-4 text-emerald-400" />
                                            <span>{c.start} – {c.end}</span>
                                        </div>
                                    </div>

                                    {/* Chat button */}
                                    <button
                                        onClick={() => navigate(`/dentist-dashboard/chat/${c.id}`)}
                                        disabled={!withinTime}
                                        title={withinTime ? 'Open Chat' : 'Chat available only during appointment time'}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all shrink-0 ${withinTime
                                                ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm shadow-emerald-200'
                                                : 'bg-emerald-50 text-emerald-300 cursor-not-allowed'
                                            }`}
                                    >
                                        <ChatBubbleLeftRightIcon className="w-4 h-4" />
                                        Chat
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default UpcomingConsultations;