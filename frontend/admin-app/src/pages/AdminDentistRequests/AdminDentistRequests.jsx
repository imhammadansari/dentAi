import React, { useState, useEffect } from 'react';
import {
    CheckCircleIcon, XCircleIcon, ClockIcon, UserCircleIcon,
    PhoneIcon, EnvelopeIcon, IdentificationIcon, MagnifyingGlassIcon,
    FunnelIcon, BriefcaseIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminRequests = () => {
    const [dentists, setDentists] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [processingId, setProcessingId] = useState(null);

    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');

    useEffect(() => { fetchDentists(); }, []);

    useEffect(() => {
        let result = [...dentists];
        if (searchTerm) {
            result = result.filter(d =>
                d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.licenseNumber?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (selectedStatus !== 'All') {
            result = result.filter(d => d.approvalStatus === selectedStatus);
        }
        setFiltered(result);
    }, [dentists, searchTerm, selectedStatus]);

    const fetchDentists = async () => {
        setLoading(true);
        try {
            // Fetch ALL dentists (not just pending) so admin can see full picture
            const res = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/api/dentists/admin/all`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setDentists(res.data.data || []);
        } catch (err) {
            console.log(err.message);
            toast.error('Failed to load dentist requests');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (dentistId, newStatus) => {
        setProcessingId(dentistId);
        try {
            await axios.put(
                `${import.meta.env.VITE_SERVER_URL}/api/dentists/${dentistId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(`Dentist ${newStatus.toLowerCase()} successfully`);
            setDentists(prev =>
                prev.map(d => d._id === dentistId ? { ...d, approvalStatus: newStatus } : d)
            );
        } catch (err) {
            toast.error('Failed to update status');
        } finally {
            setProcessingId(null);
        }
    };

    const stats = {
        pending: dentists.filter(d => d.approvalStatus === 'Pending').length,
        approved: dentists.filter(d => d.approvalStatus === 'Approved').length,
        rejected: dentists.filter(d => d.approvalStatus === 'Rejected').length,
        total: dentists.length
    };

    const statusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-amber-100 text-amber-700';
            case 'Approved': return 'bg-emerald-100 text-emerald-700';
            case 'Rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="p-2 lg:p-4 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dentist Requests</h1>
                <p className="text-emerald-600">Review and manage dentist registration requests</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Pending', value: stats.pending, icon: ClockIcon, color: 'bg-amber-50', iconColor: 'text-amber-600' },
                    { label: 'Approved', value: stats.approved, icon: CheckCircleIcon, color: 'bg-emerald-50', iconColor: 'text-emerald-600' },
                    { label: 'Rejected', value: stats.rejected, icon: XCircleIcon, color: 'bg-red-50', iconColor: 'text-red-600' },
                    { label: 'Total', value: stats.total, icon: UserCircleIcon, color: 'bg-gray-50', iconColor: 'text-gray-600' },
                ].map((s, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">{s.label}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
                            </div>
                            <div className={`p-2.5 rounded-xl ${s.color}`}>
                                <s.icon className={`w-5 h-5 ${s.iconColor}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search by name, email, specialty..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <FunnelIcon className="w-5 h-5 text-gray-400" />
                    <select
                        value={selectedStatus}
                        onChange={e => setSelectedStatus(e.target.value)}
                        className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    >
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
                <button
                    onClick={fetchDentists}
                    className="px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl font-medium hover:bg-emerald-100 transition-colors"
                >
                    Refresh
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center py-12 gap-3">
                        <div className="w-10 h-10 border-4 border-t-emerald-500 border-emerald-200 rounded-full animate-spin" />
                        <p className="text-gray-500">Loading requests...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-12">
                        <UserCircleIcon className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                        <p className="text-gray-500">No dentist requests found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3 px-5 text-left text-sm font-semibold text-gray-700">Dentist</th>
                                    <th className="py-3 px-5 text-left text-sm font-semibold text-gray-700">Contact</th>
                                    <th className="py-3 px-5 text-left text-sm font-semibold text-gray-700">Professional Info</th>
                                    <th className="py-3 px-5 text-left text-sm font-semibold text-gray-700">Status</th>
                                    <th className="py-3 px-5 text-left text-sm font-semibold text-gray-700">Date</th>
                                    <th className="py-3 px-5 text-left text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map(dentist => (
                                    <tr key={dentist._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-green-400 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                                    {dentist.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{dentist.name}</p>
                                                    <p className="text-xs text-gray-400">{dentist.specialty}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-5">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                    <EnvelopeIcon className="w-3.5 h-3.5 text-gray-400" />
                                                    {dentist.email}
                                                </div>
                                                {dentist.phone && (
                                                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                        <PhoneIcon className="w-3.5 h-3.5 text-gray-400" />
                                                        {dentist.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-5">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                    <IdentificationIcon className="w-3.5 h-3.5 text-gray-400" />
                                                    {dentist.licenseNumber || <span className="text-gray-300">No licence</span>}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                    <BriefcaseIcon className="w-3.5 h-3.5 text-gray-400" />
                                                    {dentist.specialty || '—'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-5">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusColor(dentist.approvalStatus)}`}>
                                                {dentist.approvalStatus === 'Pending' && <ClockIcon className="w-3.5 h-3.5" />}
                                                {dentist.approvalStatus === 'Approved' && <CheckCircleIcon className="w-3.5 h-3.5" />}
                                                {dentist.approvalStatus === 'Rejected' && <XCircleIcon className="w-3.5 h-3.5" />}
                                                {dentist.approvalStatus}
                                            </span>
                                        </td>
                                        <td className="py-4 px-5">
                                            <p className="text-sm text-gray-600">{new Date(dentist.createdAt).toLocaleDateString()}</p>
                                            <p className="text-xs text-gray-400">{new Date(dentist.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </td>
                                        <td className="py-4 px-5">
                                            <div className="flex gap-2">
                                                {dentist.approvalStatus === 'Pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusChange(dentist._id, 'Approved')}
                                                            disabled={processingId === dentist._id}
                                                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                                                        >
                                                            <CheckCircleIcon className="w-4 h-4" />
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(dentist._id, 'Rejected')}
                                                            disabled={processingId === dentist._id}
                                                            className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                                                        >
                                                            <XCircleIcon className="w-4 h-4" />
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                {(dentist.approvalStatus === 'Approved' || dentist.approvalStatus === 'Rejected') && (
                                                    <button
                                                        onClick={() => handleStatusChange(dentist._id, 'Pending')}
                                                        disabled={processingId === dentist._id}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                                                    >
                                                        <ClockIcon className="w-4 h-4" />
                                                        Reset to Pending
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminRequests;