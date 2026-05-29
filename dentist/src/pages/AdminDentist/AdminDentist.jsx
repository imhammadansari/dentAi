import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    UsersIcon, TrashIcon, MagnifyingGlassIcon, CheckBadgeIcon,
    FunnelIcon, EnvelopeIcon, IdentificationIcon, BriefcaseIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const AdminDentist = () => {
    const [dentists, setDentists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [deletingId, setDeletingId] = useState(null);

    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');

    const fetchDentists = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/api/dentists/admin/all`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setDentists(res.data.data || []);
        } catch (err) {
            console.log(err.message);
            toast.error('Failed to load dentists');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDentists(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this dentist?')) return;
        setDeletingId(id);
        try {
            await axios.delete(
                `${import.meta.env.VITE_SERVER_URL}/api/dentists/admin/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Dentist deleted');
            setDentists(prev => prev.filter(d => d._id !== id));
        } catch (err) {
            toast.error('Failed to delete dentist');
        } finally {
            setDeletingId(null);
        }
    };

    const filtered = dentists.filter(d => {
        const matchSearch =
            d.name?.toLowerCase().includes(search.toLowerCase()) ||
            d.email?.toLowerCase().includes(search.toLowerCase()) ||
            d.specialty?.toLowerCase().includes(search.toLowerCase()) ||
            d.licenseNumber?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'all' || d.approvalStatus === filterStatus;
        return matchSearch && matchStatus;
    });

    const approvedCount = dentists.filter(d => d.approvalStatus === 'Approved').length;

    return (
        <div className="p-2 lg:p-4 min-h-full space-y-6">
            <div>
                <h3 className="text-2xl font-bold text-gray-900">All Dentists</h3>
                <p className="text-emerald-600">Manage all dental professionals on the platform</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                    { label: 'Total Dentists', value: dentists.length, color: 'from-emerald-500 to-green-400' },
                    { label: 'Approved', value: approvedCount, color: 'from-green-500 to-emerald-400' },
                    { label: 'Pending / Rejected', value: dentists.length - approvedCount, color: 'from-amber-400 to-orange-400' },
                ].map((c, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm">
                        <div className={`w-9 h-9 bg-gradient-to-br ${c.color} rounded-xl mb-2 flex items-center justify-center`}>
                            <UsersIcon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">{c.value}</h3>
                        <p className="text-xs text-gray-500 mt-1">{c.label}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="w-5 h-5 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search by name, email, specialty or licence..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                </div>
                <div className="relative">
                    <FunnelIcon className="w-5 h-5 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                        className="pl-10 pr-8 py-3 bg-emerald-50 border border-emerald-100 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    >
                        <option value="all">All Status</option>
                        <option value="Approved">Approved</option>
                        <option value="Pending">Pending</option>
                        <option value="Rejected">Rejected</option>
                    </select>
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
                                    <th className="py-4 px-5 text-left text-sm font-semibold text-gray-700">Dentist</th>
                                    <th className="py-4 px-5 text-left text-sm font-semibold text-gray-700">Expertise</th>
                                    <th className="py-4 px-5 text-left text-sm font-semibold text-gray-700">Licence Number</th>
                                    <th className="py-4 px-5 text-left text-sm font-semibold text-gray-700">Status</th>
                                    <th className="py-4 px-5 text-left text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-emerald-50">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center">
                                            <UsersIcon className="w-10 h-10 text-emerald-200 mx-auto mb-2" />
                                            <p className="text-gray-400">No dentists found</p>
                                        </td>
                                    </tr>
                                ) : filtered.map(dentist => (
                                    <tr key={dentist._id} className="hover:bg-emerald-50/40 transition-colors">
                                        <td className="py-4 px-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-green-400 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                                    {dentist.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{dentist.name}</p>
                                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                                        <EnvelopeIcon className="w-3 h-3" />
                                                        {dentist.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-5">
                                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full">
                                                {dentist.specialty || '—'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-5">
                                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                <IdentificationIcon className="w-4 h-4 text-emerald-400" />
                                                {dentist.licenseNumber || <span className="text-gray-300">Not provided</span>}
                                            </div>
                                        </td>
                                        <td className="py-4 px-5">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                                                dentist.approvalStatus === 'Approved'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : dentist.approvalStatus === 'Pending'
                                                    ? 'bg-amber-100 text-amber-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}>
                                                {dentist.approvalStatus === 'Approved' && <CheckBadgeIcon className="w-3.5 h-3.5" />}
                                                {dentist.approvalStatus}
                                            </span>
                                        </td>
                                        <td className="py-4 px-5">
                                            <button
                                                onClick={() => handleDelete(dentist._id)}
                                                disabled={deletingId === dentist._id}
                                                className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                                                title="Delete dentist"
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

            <p className="text-sm text-gray-500">Showing {filtered.length} of {dentists.length} dentists</p>
        </div>
    );
};

export default AdminDentist;