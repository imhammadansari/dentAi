import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    UserGroupIcon, TrashIcon, MagnifyingGlassIcon,
    EnvelopeIcon, PhoneIcon, CalendarDaysIcon, ClockIcon,
    DocumentTextIcon, UsersIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const AdminAllPatients = () => {
    const [patients, setPatients] = useState([]);
    const [stats, setStats] = useState({ totalPatients: 0, totalAppointments: 0, upcomingCount: 0, totalReports: 0 });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [deletingId, setDeletingId] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/api/users/admin/all`,
                { withCredentials: true }
            );
            setPatients(res.data.data);
            setStats(res.data.stats);
        } catch (err) {
            console.log(err.message);
            toast.error('Failed to load patients');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this patient?')) return;
        setDeletingId(id);
        try {
            await axios.delete(
                `${import.meta.env.VITE_SERVER_URL}/api/users/admin/${id}`,
                { withCredentials: true }
            );
            toast.success('Patient deleted successfully');
            setPatients(prev => prev.filter(p => p.id !== id));
            setStats(prev => ({ ...prev, totalPatients: prev.totalPatients - 1 }));
        } catch (err) {
            toast.error('Failed to delete patient');
        } finally {
            setDeletingId(null);
        }
    };

    const filtered = patients.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.email?.toLowerCase().includes(search.toLowerCase()) ||
        p.phone?.includes(search)
    );

    const statCards = [
        { icon: UsersIcon, label: 'Total Patients', value: stats.totalPatients, color: 'from-emerald-500 to-green-400' },
        { icon: CalendarDaysIcon, label: 'Appointments', value: stats.totalAppointments, color: 'from-emerald-500 to-emerald-400' },
        { icon: ClockIcon, label: 'Upcoming', value: stats.upcomingCount, color: 'from-amber-400 to-orange-400' },
        { icon: DocumentTextIcon, label: 'Total Reports', value: stats.totalReports, color: 'from-gray-400 to-gray-300' },
    ];

    return (
        <div className="lg:p-4 min-h-full space-y-6">
            <div>
                <h3 className="text-2xl font-bold text-gray-900">All Patients</h3>
                <p className="text-emerald-600">Manage all patients on the platform</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <div className={`w-9 h-9 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center`}>
                                <card.icon className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
                        <p className="text-xs text-gray-500 mt-1">{card.label}</p>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm">
                <div className="relative">
                    <MagnifyingGlassIcon className="w-5 h-5 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search by name, email or phone..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-10 h-10 border-4 border-t-emerald-500 border-emerald-200 rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-emerald-50">
                                <tr>
                                    <th className="py-4 px-5 text-left text-sm font-semibold text-gray-700">Patient</th>
                                    <th className="py-4 px-5 text-left text-sm font-semibold text-gray-700">Contact</th>
                                    <th className="py-4 px-5 text-left text-sm font-semibold text-gray-700">Age / Gender</th>
                                    <th className="py-4 px-5 text-left text-sm font-semibold text-gray-700">Total Sessions</th>
                                    <th className="py-4 px-5 text-left text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-emerald-50">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center">
                                            <UserGroupIcon className="w-10 h-10 text-emerald-200 mx-auto mb-2" />
                                            <p className="text-gray-400">No patients found</p>
                                        </td>
                                    </tr>
                                ) : filtered.map(patient => (
                                    <tr key={patient.id} className="hover:bg-emerald-50/40 transition-colors">
                                        <td className="py-4 px-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-green-400 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                                    {patient.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{patient.name}</p>
                                                    <p className="text-xs text-gray-400">Joined {new Date(patient.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-5">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                    <EnvelopeIcon className="w-3.5 h-3.5 text-emerald-400" />
                                                    {patient.email}
                                                </div>
                                                {patient.phone && (
                                                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                        <PhoneIcon className="w-3.5 h-3.5 text-emerald-400" />
                                                        {patient.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-5">
                                            <p className="text-gray-700 text-sm">{patient.age ? `${patient.age} yrs` : <span className="text-gray-300">—</span>}</p>
                                            <p className="text-xs text-gray-400 capitalize">{patient.gender || '—'}</p>
                                        </td>
                                        <td className="py-4 px-5">
                                            <span className="inline-flex items-center whitespace-nowrap px-2 py-1 sm:px-3 sm:py-2 bg-emerald-100 text-emerald-700 rounded-full text-xs sm:text-sm font-medium">
                                                {patient.totalVisits} session{patient.totalVisits !== 1 ? 's' : ''}
                                            </span>
                                        </td>
                                        <td className="py-4 px-5">
                                            <button
                                                onClick={() => handleDelete(patient.id)}
                                                disabled={deletingId === patient.id}
                                                className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                                                title="Delete patient"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <p className="text-sm text-gray-500">Showing {filtered.length} of {patients.length} patients</p>
        </div>
    );
};

export default AdminAllPatients;