import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    UsersIcon,
    CalendarDaysIcon,
    ClockIcon,
    ArrowTrendingUpIcon,
    UserGroupIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from "react-router-dom";

const DentistDashboard = () => {
    const [dashData, setDashData] = useState({
        totalPatients: 0,
        totalAppointments: 0,
        upcomingCount: 0,
        recentPatients: [],
        upcomingAppointments: [],
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");

                // Fetch unique patients + stats
                const patientsRes = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/api/bookings/dentist-patients`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                // Fetch all raw bookings for upcoming list
                const bookingsRes = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/api/bookings/dentist-all-bookings`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const { patients, stats } = patientsRes.data;
                const allBookings = bookingsRes.data.data || [];

                // Total appointments = booked + completed only
                const totalAppt = allBookings.filter(
                    b => b.status?.toLowerCase() === "booked" || b.status?.toLowerCase() === "completed"
                ).length;

                // Upcoming = only booked
                const upcomingBookings = allBookings
                    .filter(b => b.status?.toLowerCase() === "booked")
                    .sort((a, b) => new Date(a.date) - new Date(b.date));

                setDashData({
                    totalPatients: stats.totalPatients,
                    totalAppointments: totalAppt,
                    upcomingCount: upcomingBookings.length,
                    recentPatients: patients.slice(0, 5),
                    upcomingAppointments: upcomingBookings.slice(0, 5),
                });

            } catch (error) {
                console.log(error.message);
            }
        };
        fetchData();
    }, []);

    const statCards = [
        { icon: UsersIcon, label: "Total Patients", value: dashData.totalPatients, color: "from-emerald-500 to-green-400" },
        { icon: CalendarDaysIcon, label: "Appointments", value: dashData.totalAppointments, color: "from-emerald-500 to-green-400" },
        { icon: ClockIcon, label: "Upcoming", value: dashData.upcomingCount, color: "from-amber-400 to-orange-400" },
    ];

    return (
        <div className="lg:p-4 space-y-6 min-h-full">
            <div>
                <h3 className="text-xl font-bold text-black">Practice Overview</h3>
                <p className="text-emerald-600">Monitor your dental practice performance</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-emerald-600 font-medium">{stat.label}</p>
                                <h3 className="text-3xl font-bold text-black mt-2">{stat.value}</h3>
                                <div className="flex items-center mt-2">
                                    <ArrowTrendingUpIcon className="w-4 h-4 text-emerald-500 mr-1" />
                                    <span className="text-sm text-emerald-500">all time</span>
                                </div>
                            </div>
                            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Appointments */}
                <div className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-lg font-bold text-black">Upcoming Appointments</h4>
                        <button onClick={() => navigate("/dentist-dashboard/appointments")} className="text-emerald-600 hover:text-emerald-700 font-medium">
                            View All →
                        </button>
                    </div>
                    <div className="space-y-4">
                        {dashData.upcomingAppointments.length > 0 ? (
                            dashData.upcomingAppointments.map((booking) => (
                                <div key={booking.id} className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-100 text-amber-600">
                                            <ClockIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h5 className="font-semibold text-black">{booking.patient?.name}</h5>
                                            <p className="text-sm text-emerald-600">{booking.date} • {booking.start} - {booking.end}</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Booked</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-emerald-600 py-6">No Upcoming Appointments</p>
                        )}
                    </div>
                </div>

                {/* Recent Patients */}
                <div className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-lg font-bold text-black">Recent Patients</h4>
                        <button onClick={() => navigate("/dentist-dashboard/patients")} className="text-emerald-600 hover:text-emerald-700 font-medium">
                            View All →
                        </button>
                    </div>
                    <div className="space-y-4">
                        {dashData.recentPatients.length > 0 ? (
                            dashData.recentPatients.map((patient) => (
                                <div
                                    key={patient.id}
                                    className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-xl hover:bg-emerald-50 transition-all cursor-pointer"
                                    onClick={() => navigate(`/dentist-dashboard/patient/${patient.id}`)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-400 rounded-full flex items-center justify-center">
                                            <span className="text-white font-semibold text-sm">
                                                {patient.name?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <h5 className="font-semibold text-black">{patient.name}</h5>
                                            <p className="text-sm text-emerald-600">{patient.email}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs font-medium text-emerald-600">{patient.totalVisits} visit{patient.totalVisits !== 1 ? 's' : ''}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-emerald-600 py-6">No Patients</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Today's Schedule */}
            <TodaySchedule />
        </div>
    );
};

const TodaySchedule = () => {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/api/bookings/today-schedule`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setSchedule(res.data.data || []);
            } catch (err) {
                console.log(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSchedule();
    }, []);

    return (
        <div className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-bold text-black">Today's Schedule</h4>
                <span className="text-sm text-emerald-600 font-medium">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
            </div>

            {loading ? (
                <p className="text-center text-emerald-600 py-6">Loading...</p>
            ) : schedule.length === 0 ? (
                <p className="text-center text-emerald-600 py-6">No slots scheduled for today.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {schedule.map((slot) => (
                        <div key={slot.id} className="flex flex-col gap-1 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                            <p className="text-emerald-800 font-semibold text-sm">{slot.start}</p>
                            <p className="text-emerald-500 text-xs">to {slot.end}</p>
                            {slot.isBooked && slot.patientName && (
                                <p className="text-xs text-emerald-700 truncate mt-1">{slot.patientName}</p>
                            )}
                            <span className={`mt-1 px-2 py-1 rounded-lg text-xs font-medium text-center ${slot.isBooked ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                                }`}>
                                {slot.isBooked ? 'Booked' : 'Available'}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DentistDashboard;