import React, { useState } from 'react';
import {
    UsersIcon,
    CalendarDaysIcon,
    CurrencyDollarIcon,
    ClockIcon,
    ArrowTrendingUpIcon,
    CheckCircleIcon,
    XCircleIcon,
    UserGroupIcon,
} from '@heroicons/react/24/outline';

const DentistDashboard = () => {
    const [timeFilter, setTimeFilter] = useState('today');

    const stats = [
        { icon: UsersIcon, label: 'Total Patients', value: '400', change: '+12%', color: 'from-emerald-500 to-green-400' },
        { icon: CalendarDaysIcon, label: 'Appointments', value: '42', change: '+8%', color: 'from-emerald-500 to-green-400' },
    ];

    const upcomingAppointments = [
        { id: 1, patient: 'Hamza', time: '10:30 AM', type: 'Follow-up', status: 'confirmed' },
        { id: 2, patient: 'Abdullah', time: '11:45 AM', type: 'Consultation', status: 'confirmed' },
    ];

    const recentPatients = [
        { id: 1, name: 'Rayyan', lastVisit: '2 days ago', nextAppointment: 'Tomorrow', treatment: 'Cavity Filling' },
        { id: 2, name: 'Maaz', lastVisit: '1 week ago', nextAppointment: 'Next week', treatment: 'Cavity Filling' },
        ];

    return (
        <div className="p-2 lg:p-4 space-y-6 min-h-full">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 justify-between lg:items-center">
                <div>
                    <h3 className="text-xl font-bold text-black">Practice Overview</h3>
                    <p className="text-emerald-600">Monitor your dental practice performance</p>
                </div>
                <div className="flex gap-2">
                    {['today', 'week', 'month', 'quarter'].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setTimeFilter(filter)}
                            className={`px-4 py-2 rounded-lg font-medium capitalize ${timeFilter === filter
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-emerald-50 text-emerald-600'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-emerald-600 font-medium">{stat.label}</p>
                                <h3 className="text-3xl font-bold text-black mt-2">{stat.value}</h3>
                                <div className="flex items-center mt-2">
                                    <ArrowTrendingUpIcon className="w-4 h-4 text-emerald-500 mr-1" />
                                    <span className="text-sm font-medium text-emerald-600">{stat.change}</span>
                                    <span className="text-sm text-emerald-500 ml-2">from last month</span>
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
                <div className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-lg font-bold text-black">Upcoming Appointments</h4>
                        <button className="text-emerald-600 hover:text-emerald-700 font-medium">
                            View All →
                        </button>
                    </div>
                    <div className="space-y-4">
                        {upcomingAppointments.map((appointment) => (
                            <div key={appointment.id} className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-xl">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${appointment.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                                        }`}>
                                        {appointment.status === 'confirmed' ? (
                                            <CheckCircleIcon className="w-5 h-5" />
                                        ) : (
                                            <ClockIcon className="w-5 h-5" />
                                        )}
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-black">{appointment.patient}</h5>
                                        <p className="text-sm text-emerald-600">{appointment.time} • {appointment.type}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors">
                                        Chat
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="text-lg font-bold text-black">Recent Patients</h4>
                        <button className="text-emerald-600 hover:text-emerald-700 font-medium">
                            View All →
                        </button>
                    </div>
                    <div className="space-y-4">
                        {recentPatients.map((patient) => (
                            <div key={patient.id} className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-xl hover:bg-emerald-50 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-400 rounded-full flex items-center justify-center">
                                        <UserGroupIcon className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-black">{patient.name}</h5>
                                        <p className="text-sm text-emerald-600">Treatment: {patient.treatment}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-emerald-600">Last visit: {patient.lastVisit}</p>
                                    <p className="text-sm font-medium text-emerald-600">Next: {patient.nextAppointment}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-bold text-black">Today's Schedule</h4>
                    <div className="flex items-center gap-4">
                        <button className="px-2 text-[14px] lg:text-[16px] lg:px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors">
                            Add Time Slot
                        </button>
                        <button className="px-2 text-[14px] lg:text-[16px] lg:px-4 py-2 bg-white border-2 border-emerald-200 text-emerald-700 rounded-lg font-medium hover:bg-emerald-50 transition-colors">
                            View Calendar
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {['Morning', 'Afternoon', 'Evening', 'Night'].map((slot, idx) => (
                        <div key={idx} className="bg-emerald-50 p-4 rounded-xl">
                            <h5 className="font-semibold text-black mb-3">{slot} Shift</h5>
                            <div className="space-y-2">
                                {['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM'].slice(0, idx + 2).map((time, timeIdx) => (
                                    <div key={timeIdx} className="flex items-center justify-between p-2 bg-white rounded-lg">
                                        <span className="text-emerald-700">{time}</span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${timeIdx % 2 === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-100 text-emerald-700'
                                            }`}>
                                            {timeIdx % 2 === 0 ? 'Booked' : 'Available'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DentistDashboard;