import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    UsersIcon, UserGroupIcon, DocumentTextIcon,
    CalendarDaysIcon, ClockIcon, CheckCircleIcon,
    ArrowTrendingUpIcon, ShieldCheckIcon, ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
                const res = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/api/admin/stats`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setStats(res.data.data);
            } catch (err) {
                console.log(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = stats ? [
        {
            icon: UserGroupIcon,
            label: 'Total Patients',
            value: stats.totalPatients,
            color: 'from-emerald-500 to-green-400',
            link: '/admin-dashboard/patients'
        },
        {
            icon: UsersIcon,
            label: 'Active Dentists',
            value: stats.totalDentists,
            color: 'from-emerald-600 to-emerald-400',
            link: '/admin-dashboard/dentists'
        },
        {
            icon: CalendarDaysIcon,
            label: 'Total Appointments',
            value: stats.totalAppointments,
            color: 'from-green-500 to-emerald-400',
            link: '/admin-dashboard/patients'
        },
        {
            icon: ClockIcon,
            label: 'Upcoming',
            value: stats.upcomingCount,
            color: 'from-amber-400 to-orange-400',
            link: '/admin-dashboard/patients'
        },
        {
            icon: CheckCircleIcon,
            label: 'Completed',
            value: stats.completedCount,
            color: 'from-emerald-500 to-teal-400',
            link: '/admin-dashboard/patients'
        },
        {
            icon: ExclamationCircleIcon,
            label: 'Pending Requests',
            value: stats.pendingDentists,
            color: 'from-amber-500 to-yellow-400',
            link: '/admin-dashboard/requests'
        },
        {
            icon: DocumentTextIcon,
            label: 'Total Reports',
            value: stats.totalReports,
            color: 'from-emerald-500 to-green-500',
            link: '/admin-dashboard/reports'
        },
    ] : [];

    return (
        <div className="p-2 lg:p-4 space-y-6 min-h-full">
            <div>
                <h3 className="text-2xl font-bold text-gray-900">System Overview</h3>
                <p className="text-emerald-600">Monitor platform performance and statistics</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-10 h-10 border-4 border-t-emerald-500 border-emerald-200 rounded-full animate-spin" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {statCards.map((card, i) => (
                            <div
                                key={i}
                                onClick={() => navigate(card.link)}
                                className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`w-10 h-10 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center`}>
                                        <card.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <ArrowTrendingUpIcon className="w-4 h-4 text-emerald-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
                                <p className="text-sm text-gray-500 mt-1">{card.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Quick Links */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm">
                            <h4 className="font-bold text-gray-900 mb-4">Quick Actions</h4>
                            <div className="space-y-3">
                                {[
                                    { label: 'Review Dentist Requests', desc: `${stats?.pendingDentists || 0} pending`, link: '/admin-dashboard/requests', color: 'bg-amber-50 text-amber-700 border-amber-100' },
                                    { label: 'Manage All Patients', desc: `${stats?.totalPatients || 0} total patients`, link: '/admin-dashboard/patients', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
                                    { label: 'View All Dentists', desc: `${stats?.totalDentists || 0} active dentists`, link: '/admin-dashboard/dentists', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
                                    { label: 'Browse Reports', desc: 'View all scan reports', link: '/admin-dashboard/reports', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
                                ].map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={() => navigate(item.link)}
                                        className={`w-full flex items-center justify-between p-3 rounded-xl border ${item.color} hover:opacity-80 transition-opacity`}
                                    >
                                        <span className="font-medium text-sm">{item.label}</span>
                                        <span className="text-xs opacity-70">{item.desc} →</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm">
                            <h4 className="font-bold text-gray-900 mb-4">Platform Summary</h4>
                            <div className="space-y-4">
                                {[
                                    { label: 'Appointment Completion Rate', value: stats?.totalAppointments > 0 ? Math.round((stats.completedCount / stats.totalAppointments) * 100) : 0, color: 'bg-emerald-500' },
                                    { label: 'Dentist Approval Rate', value: stats?.totalDentists > 0 ? Math.round((stats.totalDentists / (stats.totalDentists + stats.pendingDentists)) * 100) : 0, color: 'bg-green-500' },
                                ].map((item, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm text-gray-600">{item.label}</span>
                                            <span className="text-sm font-bold text-gray-900">{item.value}%</span>
                                        </div>
                                        <div className="w-full bg-emerald-50 rounded-full h-2">
                                            <div
                                                className={`${item.color} h-2 rounded-full transition-all`}
                                                style={{ width: `${item.value}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                                <div className="pt-3 border-t border-emerald-100 grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 bg-emerald-50 rounded-xl">
                                        <p className="text-2xl font-bold text-emerald-700">{stats?.upcomingCount || 0}</p>
                                        <p className="text-xs text-gray-500 mt-1">Upcoming Appts</p>
                                    </div>
                                    <div className="text-center p-3 bg-amber-50 rounded-xl">
                                        <p className="text-2xl font-bold text-amber-700">{stats?.pendingDentists || 0}</p>
                                        <p className="text-xs text-gray-500 mt-1">Awaiting Approval</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminDashboard;