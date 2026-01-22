import React, { useState, useEffect } from 'react';
import {
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    UserCircleIcon,
    BriefcaseIcon,
    PhoneIcon,
    EnvelopeIcon,
    IdentificationIcon,
    MagnifyingGlassIcon,
    FunnelIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const AdminRequests = () => {
    const [pendingDentists, setPendingDentists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredDentists, setFilteredDentists] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [stats, setStats] = useState({
        pending: 0,
        approved: 0,
        rejected: 0,
        total: 0
    });

    useEffect(() => {
        fetchPendingDentists();
    }, []);

    useEffect(() => {
        filterDentists();
    }, [pendingDentists, searchTerm, selectedStatus]);

    const fetchPendingDentists = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8000/api/dentists/pending', {
                withCredentials: true
            });

            if (response.data.success) {
                setPendingDentists(response.data.data);
                
                const statsData = {
                    pending: response.data.data.filter(d => d.approvalStatus === 'Pending').length,
                    approved: response.data.data.filter(d => d.approvalStatus === 'Approved').length,
                    rejected: response.data.data.filter(d => d.approvalStatus === 'Rejected').length,
                    total: response.data.data.length
                };
                setStats(statsData);
            }
        } catch (error) {
            console.error('Error fetching dentists:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterDentists = () => {
        let filtered = [...pendingDentists];

        if (searchTerm) {
            filtered = filtered.filter(dentist =>
                dentist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                dentist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                dentist.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                dentist.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedStatus !== 'All') {
            filtered = filtered.filter(dentist => dentist.approvalStatus === selectedStatus);
        }

        setFilteredDentists(filtered);
    };

    const handleStatusChange = async (dentistId, newStatus) => {
        try {
            const response = await axios.put(
                `http://localhost:8000/api/dentists/${dentistId}/status`,
                { status: newStatus },
                { withCredentials: true }
            );

            if (response.data.success) {
                setPendingDentists(prev =>
                    prev.map(dentist =>
                        dentist._id === dentistId
                            ? { ...dentist, approvalStatus: newStatus }
                            : dentist
                    )
                );

                setStats(prev => ({
                    ...prev,
                    [newStatus.toLowerCase()]: prev[newStatus.toLowerCase()] + 1,
                    pending: newStatus === 'Approved' ? prev.pending - 1 : prev.pending
                }));
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Approved': return 'bg-green-100 text-green-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <ClockIcon className="w-4 h-4" />;
            case 'Approved': return <CheckCircleIcon className="w-4 h-4" />;
            case 'Rejected': return <XCircleIcon className="w-4 h-4" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dentist Requests</h1>
                <p className="text-emerald-600">Review and manage dentist registration requests</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Pending Requests</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
                        </div>
                        <div className="p-3 rounded-full bg-yellow-50">
                            <ClockIcon className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Approved</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.approved}</p>
                        </div>
                        <div className="p-3 rounded-full bg-green-50">
                            <CheckCircleIcon className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Rejected</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.rejected}</p>
                        </div>
                        <div className="p-3 rounded-full bg-red-50">
                            <XCircleIcon className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Requests</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                        <div className="p-3 rounded-full bg-emerald-50">
                            <UserCircleIcon className="w-6 h-6 text-emerald-600" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search dentists by name, email, specialty..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <FunnelIcon className="w-5 h-5 text-gray-500" />
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>

                    <button
                        onClick={fetchPendingDentists}
                        className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg font-medium hover:bg-emerald-100 transition-colors"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="w-12 h-12 border-4 border-t-emerald-500 border-emerald-200 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading dentist requests...</p>
                    </div>
                ) : filteredDentists.length === 0 ? (
                    <div className="p-12 text-center">
                        <UserCircleIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">No dentist requests found</p>
                        <p className="text-sm text-gray-500 mt-1">All requests have been processed</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Dentist</th>
                                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Contact</th>
                                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Professional</th>
                                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Status</th>
                                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Date</th>
                                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredDentists.map((dentist) => (
                                    <tr key={dentist._id} className="hover:bg-gray-50">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-semibold">
                                                    {dentist.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{dentist.name}</p>
                                                    <p className="text-sm text-gray-600">{dentist.specialty}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm text-gray-700">{dentist.email}</span>
                                                </div>
                                                {dentist.phone && (
                                                    <div className="flex items-center gap-2">
                                                        <PhoneIcon className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-700">{dentist.phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <IdentificationIcon className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm text-gray-700">{dentist.licenseNumber}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <BriefcaseIcon className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm text-gray-700">{dentist.specialty}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(dentist.approvalStatus)}`}>
                                                {getStatusIcon(dentist.approvalStatus)}
                                                {dentist.approvalStatus}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-sm text-gray-700">
                                                {new Date(dentist.createdAt).toLocaleDateString()}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(dentist.createdAt).toLocaleTimeString()}
                                            </p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex gap-2">
                                                {dentist.approvalStatus === 'Pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusChange(dentist._id, 'Approved')}
                                                            className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors flex items-center gap-1"
                                                        >
                                                            <CheckCircleIcon className="w-4 h-4" />
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(dentist._id, 'Rejected')}
                                                            className="px-3 py-1 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-1"
                                                        >
                                                            <XCircleIcon className="w-4 h-4" />
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                {(dentist.approvalStatus === 'Approved' || dentist.approvalStatus === 'Rejected') && (
                                                    <button
                                                        onClick={() => handleStatusChange(dentist._id, 'Pending')}
                                                        className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-100 transition-colors flex items-center gap-1"
                                                    >
                                                        <ClockIcon className="w-4 h-4" />
                                                        Reset
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