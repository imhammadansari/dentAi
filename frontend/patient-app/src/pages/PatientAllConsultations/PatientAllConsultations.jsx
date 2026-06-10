import React, { useEffect, useState, useCallback } from 'react';
import { CalendarDaysIcon, ChatBubbleLeftRightIcon, EyeIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SERVER = import.meta.env.VITE_SERVER_URL;

const PatientAllConsultations = () => {
    const [consultations, setConsultations] = useState([]);
    const [totalVisits, setTotalVisits] = useState(0);
    const [activeTab, setActiveTab] = useState('Booked');
    const [chatStatuses, setChatStatuses] = useState({}); // bookingId -> { exists, hasMessages, status }
    const navigate = useNavigate();

    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    const authHeader = { Authorization: `Bearer ${token}` };

    // Auto-complete past bookings on load
    const autoComplete = useCallback(async () => {
        try {
            await axios.post(`${SERVER}/api/chat/auto-complete-bookings`, {}, { headers: authHeader });
        } catch (_) {}
    }, []);

    const fetchData = useCallback(async () => {
        try {
            const res = await axios.get(`${SERVER}/api/bookings/my-consultations`, { headers: authHeader });
            setConsultations(res.data.data || []);
            setTotalVisits(res.data.totalVisits || 0);
        } catch (err) {
            console.log(err.message);
        }
    }, []);

    useEffect(() => {
        const init = async () => {
            await autoComplete();
            await fetchData();
        };
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
                        const res = await axios.get(`${SERVER}/api/chat/${c.id}/status`, { headers: authHeader });
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

    const isWithinAppointmentTime = (consultation) => {
        const now = new Date();
        const today =
            now.getFullYear() + '-' +
            String(now.getMonth() + 1).padStart(2, '0') + '-' +
            String(now.getDate()).padStart(2, '0');
        if (!consultation.date || consultation.date !== today) return false;
        if (!consultation.time) return false;
        const parts = consultation.time.split(' - ');
        const startStr = parts[0]?.trim();
        const endStr = parts[1]?.trim();
        if (!startStr || !endStr) return false;
        const [sh, sm] = startStr.split(':').map(Number);
        const [eh, em] = endStr.split(':').map(Number);
        const start = new Date(); start.setHours(sh, sm, 0, 0);
        const end = new Date(); end.setHours(eh, em, 0, 0);
        return now >= start && now <= end;
    };

    const tabs = ['Booked', 'Completed', 'Cancelled'];

    const filteredConsultations = consultations.filter(
        (c) => c.status?.toLowerCase() === activeTab.toLowerCase()
    );

    const statusColors = {
        completed: 'bg-green-100 text-green-700',
        booked: 'bg-amber-100 text-amber-700',
        cancelled: 'bg-red-100 text-red-700',
    };

    const iconColors = {
        completed: 'bg-green-100 text-green-600',
        booked: 'bg-amber-100 text-amber-600',
        cancelled: 'bg-red-100 text-red-600',
    };

    return (
        <div className="lg:p-4">
            <div className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm">
                <div className="flex flex-col lg:flex-row items-center justify-between mb-6 gap-4">
                    <h3 className="text-xl font-bold text-emerald-900">Consultation History</h3>
                    <div className="flex gap-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    activeTab === tab
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredConsultations.length === 0 ? (
                        <div className="text-center py-10 text-emerald-600">
                            No {activeTab.toLowerCase()} consultations found.
                        </div>
                    ) : (
                        filteredConsultations.map((consultation) => {
                            const statusKey = consultation.status?.toLowerCase();
                            const withinTime = isWithinAppointmentTime(consultation);
                            const chatInfo = chatStatuses[consultation.id];
                            const hasChat = chatInfo?.exists && chatInfo?.hasMessages;

                            return (
                                <div
                                    key={consultation.id}
                                    className={`p-4 rounded-xl ${
                                        statusKey === 'booked'
                                            ? 'bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100'
                                            : 'bg-white border border-emerald-100'
                                    }`}
                                >
                                    <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-4 lg:gap-0">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${iconColors[statusKey] || 'bg-gray-100 text-gray-600'}`}>
                                                <CalendarDaysIcon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-emerald-900 text-lg">Dr. {consultation.dentist}</h4>
                                                <p className="text-emerald-600">
                                                    {new Date(consultation.date).toLocaleDateString()} • {consultation.time}
                                                </p>
                                                {consultation.notes && (
                                                    <p className="text-emerald-700 mt-1 text-sm">{consultation.notes}</p>
                                                )}
                                                <p className="text-emerald-900 text-[13px] mt-1">
                                                    Total Sessions: {totalVisits}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center gap-3 flex-wrap">

                                            {/* During appointment time: active Chat button */}
                                            {statusKey === 'booked' && withinTime && (
                                                <button
                                                    onClick={() => navigate(`/patient-dashboard/chat/${consultation.id}`)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm transition-all"
                                                >
                                                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                                                    Open Chat
                                                </button>
                                            )}

                                            {/* Booked but not yet time: disabled chat */}
                                            {statusKey === 'booked' && !withinTime && !hasChat && (
                                                <button
                                                    disabled
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-emerald-50 text-emerald-300 cursor-not-allowed"
                                                    title="Chat available only during appointment time"
                                                >
                                                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                                                    Chat
                                                </button>
                                            )}

                                            {/* View Chat — shown whenever a chat with messages exists */}
                                            {hasChat && (
                                                <button
                                                    onClick={() => navigate(`/patient-dashboard/chat/${consultation.id}`)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 transition-all"
                                                >
                                                    <EyeIcon className="w-4 h-4" />
                                                    View Chat
                                                </button>
                                            )}

                                            <span className={`px-4 py-2 rounded-full font-medium text-sm ${statusColors[statusKey] || 'bg-gray-100 text-gray-700'}`}>
                                                {consultation.status?.charAt(0).toUpperCase() + consultation.status?.slice(1)}
                                            </span>

                                            <button
                                                onClick={() =>
                                                    navigate(`/patient-dashboard/consultation/${consultation.id}`, {
                                                        state: { consultation }
                                                    })
                                                }
                                                className="px-6 py-2 border-2 border-emerald-200 text-emerald-700 rounded-lg font-medium hover:bg-emerald-50 transition-colors"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientAllConsultations;