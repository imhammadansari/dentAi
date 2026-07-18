import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    CalendarDaysIcon,
    ChatBubbleLeftRightIcon,
    ClockIcon,
    UserIcon,
    MagnifyingGlassIcon,
    EyeIcon,
    FunnelIcon,
} from '@heroicons/react/24/outline';

const SERVER = import.meta.env.VITE_SERVER_URL;

const UpcomingConsultations = () => {
    const navigate = useNavigate();
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [chatStatuses, setChatStatuses] = useState({}); // bookingId -> { exists, hasMessages, status }


    // Auto-complete past bookings, then fetch all bookings
    const init = useCallback(async () => {
        try {
            // Silently auto-complete any past bookings
            await axios.post(`${SERVER}/api/chat/auto-complete-bookings`, {}, { withCredentials: true });
        } catch (_) { }

        try {
            const res = await axios.get(`${SERVER}/api/bookings/dentist-all-bookings`, { withCredentials: true });
            // Show Booked + Completed (not Cancelled)
            const relevant = (res.data.data || []).filter(
                b => b.status?.toLowerCase() == 'booked'
            );
            setConsultations(relevant);
        } catch (err) {
            console.log('fetchConsultations error:', err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        init();
    }, []);

    // After consultations load, check chat status for each booking
    useEffect(() => {
        if (!consultations.length) return;
        const checkChats = async () => {
            const statuses = {};
            await Promise.all(
                consultations.map(async (c) => {
                    try {
                        const res = await axios.get(`${SERVER}/api/chat/${c.id}/status`,  { withCredentials: true });
                        statuses[c.id] = res.data;
                    } catch (_) {
                        statuses[c.id] = { exists: false };
                    }
                })
            );
            setChatStatuses(statuses);
        };
        checkChats();
    }, [consultations]);

    const isWithinAppointmentTime = (c) => {
        const now = new Date();
        const today =
            now.getFullYear() + '-' +
            String(now.getMonth() + 1).padStart(2, '0') + '-' +
            String(now.getDate()).padStart(2, '0');

        if (!c.date) return false;
        const bookingDate = new Date(c.date).toISOString().split('T')[0];
        if (bookingDate !== today) return false;

        const [sh, sm] = (c.start || '00:00').split(':').map(Number);
        const [eh, em] = (c.end || '00:00').split(':').map(Number);
        const start = new Date(); start.setHours(sh, sm, 0, 0);
        const end = new Date(); end.setHours(eh, em, 0, 0);
        return now >= start && now <= end;
    };

    const filtered = consultations.filter(c => {
        const q = search.toLowerCase();
        const matchSearch =
            c.patient?.name?.toLowerCase().includes(q) ||
            c.patient?.email?.toLowerCase().includes(q) ||
            c.date?.includes(q);
        const matchStatus =
            statusFilter === 'all' ||
            c.status?.toLowerCase() === statusFilter.toLowerCase();
        return matchSearch && matchStatus;
    });

    const statusColors = {
        booked: 'bg-amber-100 text-amber-700',
        completed: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700',
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-emerald-900">Consultations</h2>
                    <p className="text-emerald-600 text-sm mt-1">
                        {loading ? '...' : `${consultations.length} total appointment${consultations.length !== 1 ? 's' : ''}`}
                    </p>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                    {/* Status filter */}
                    {/* <div className="relative">
                        <FunnelIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="pl-9 pr-4 py-2.5 rounded-xl border border-emerald-200 bg-white text-sm text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                        >
                            <option value="all">All</option>
                            <option value="booked">Booked</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div> */}

                    {/* Search */}
                    <div className="relative flex-1 sm:w-64">
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
                        {search ? 'No results found' : 'No consultations'}
                    </h3>
                    <p className="text-emerald-500 text-sm">
                        {search ? 'Try a different search term.' : 'New bookings will appear here.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(c => {
                        const withinTime = isWithinAppointmentTime(c);
                        const statusKey = c.status?.toLowerCase();
                        const chatInfo = chatStatuses[c.id];
                        const hasChat = chatInfo?.exists && chatInfo?.hasMessages;

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

                                    {/* Status badge */}
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 ${statusColors[statusKey] || 'bg-gray-100 text-gray-700'}`}>
                                        {c.status?.charAt(0).toUpperCase() + c.status?.slice(1)}
                                    </span>

                                    {/* Action buttons */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        {/* Active chat during appointment time */}
                                        {statusKey === 'booked' && withinTime && (
                                            <button
                                                onClick={() => navigate(`/dentist-dashboard/chat/${c.id}`)}
                                                className="flex cursor-pointer items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm shadow-emerald-200 transition-all"
                                            >
                                                <ChatBubbleLeftRightIcon className="w-4 h-4" />
                                                Open Chat
                                            </button>
                                        )}

                                        {/* Booked but not yet time and no chat yet */}
                                        {statusKey === 'booked' && !withinTime && !hasChat && (
                                            <button
                                                disabled
                                                title="Chat available only during appointment time"
                                                className="flex cursor-pointer items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-emerald-50 text-emerald-300 cursor-not-allowed"
                                            >
                                                <ChatBubbleLeftRightIcon className="w-4 h-4" />
                                                Chat
                                            </button>
                                        )}

                                        {/* View Chat — shown whenever a chat with messages exists */}
                                        {hasChat && (
                                            <button
                                                onClick={() => navigate(`/dentist-dashboard/chat/${c.id}`)}
                                                className="flex cursor-pointer items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 transition-all"
                                            >
                                                <EyeIcon className="w-4 h-4" />
                                                View Chat
                                            </button>
                                        )}
                                    </div>
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