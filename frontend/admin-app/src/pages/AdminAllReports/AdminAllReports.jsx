import React, { useState, useEffect, useCallback } from 'react';
import {
    DocumentTextIcon, MagnifyingGlassIcon, FunnelIcon,
    CalendarDaysIcon, ArrowDownTrayIcon, ClockIcon,
    UserIcon, ShieldCheckIcon, ArrowPathIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const SERVER = import.meta.env.VITE_SERVER_URL || 'https://13.51.175.156.nip.io';

const AdminAllReports = () => {
    const [reports, setReports] = useState([]);
    const [stats, setStats] = useState({ total: 0, saved: 0, generated: 0, byPatient: 0, byDentist: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [search, setSearch] = useState('');
    const [dateFilter, setDateFilter] = useState('all');
    const [uploadedByFilter, setUploadedByFilter] = useState('all');

    const token = localStorage.getItem('accessToken');
    const authHeader = { Authorization: `Bearer ${token}` };

    const fetchReports = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const params = new URLSearchParams();
            if (search) params.set('search', search);
            if (dateFilter !== 'all') params.set('dateFilter', dateFilter);
            if (uploadedByFilter !== 'all') params.set('uploadedBy', uploadedByFilter);
            params.set('limit', '200');

            const res = await axios.get(`${SERVER}/api/reports/admin/all?${params}`, { headers: authHeader });
            if (res.data.success) {
                setReports(res.data.data);
                setStats(res.data.stats);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load reports');
        } finally {
            setLoading(false);
        }
    }, [search, dateFilter, uploadedByFilter]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(fetchReports, 300);
        return () => clearTimeout(timer);
    }, [fetchReports]);

    const handleDownload = async (reportId, patientName) => {
        try {
            const res = await axios.get(`${SERVER}/api/reports/download/${reportId}`, {
                headers: authHeader,
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.download = `DentAI_Report_${patientName?.replace(/\s+/g, '_')}_${reportId.slice(-6)}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch {
            alert('PDF not available for this report');
        }
    };

    const statCards = [
        { label: 'Total Reports', value: stats.total, color: 'from-emerald-500 to-green-400' },
        { label: 'Saved', value: stats.saved, color: 'from-blue-500 to-blue-400' },
        { label: 'Generated (PDF)', value: stats.generated, color: 'from-purple-500 to-violet-400' },
        { label: 'By Patient', value: stats.byPatient, color: 'from-teal-500 to-emerald-400' },
        { label: 'By Dentist', value: stats.byDentist, color: 'from-amber-400 to-orange-400' },
    ];

    return (
        <div className="p-2 lg:p-4 min-h-full space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">All Reports</h3>
                    <p className="text-emerald-600">View and manage all patient dental reports</p>
                </div>
                <button
                    onClick={fetchReports}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors text-sm font-medium disabled:opacity-50"
                >
                    <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {statCards.map((c, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm">
                        <div className={`w-9 h-9 bg-gradient-to-br ${c.color} rounded-xl mb-2 flex items-center justify-center`}>
                            <DocumentTextIcon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">{c.value}</h3>
                        <p className="text-xs text-gray-500 mt-1">{c.label}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search by patient or dentist..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                    </div>
                    <div className="relative">
                        <FunnelIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <select
                            value={uploadedByFilter}
                            onChange={e => setUploadedByFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        >
                            <option value="all">All Uploads</option>
                            <option value="patient">By Patient</option>
                            <option value="dentist">By Dentist</option>
                        </select>
                    </div>
                    <div className="relative">
                        <CalendarDaysIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <select
                            value={dateFilter}
                            onChange={e => setDateFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        >
                            <option value="all">All Time</option>
                            <option value="week">Last 7 Days</option>
                            <option value="month">This Month</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                    {error}
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-emerald-50">
                            <tr>
                                <th className="py-4 px-5 text-left text-sm font-semibold text-gray-700">Patient</th>
                                <th className="py-4 px-5 text-left text-sm font-semibold text-gray-700">Type</th>
                                <th className="py-4 px-5 text-left text-sm font-semibold text-gray-700">Date</th>
                                <th className="py-4 px-5 text-left text-sm font-semibold text-gray-700">Uploaded By</th>
                                <th className="py-4 px-5 text-left text-sm font-semibold text-gray-700">Issues</th>
                                <th className="py-4 px-5 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="py-4 px-5 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-emerald-50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        {Array.from({ length: 7 }).map((__, j) => (
                                            <td key={j} className="py-4 px-5">
                                                <div className="h-4 bg-emerald-100 rounded w-3/4" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : reports.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-16 text-center">
                                        <DocumentTextIcon className="w-10 h-10 text-emerald-200 mx-auto mb-2" />
                                        <p className="text-gray-400 font-medium">No reports found</p>
                                        <p className="text-gray-300 text-sm mt-1">Try adjusting your filters</p>
                                    </td>
                                </tr>
                            ) : reports.map(report => (
                                <tr key={report._id} className="hover:bg-emerald-50/40 transition-colors">
                                    <td className="py-4 px-5">
                                        <p className="font-semibold text-gray-900">{report.patientName || '—'}</p>
                                        <p className="text-xs text-gray-400 font-mono">{report.patientId?.toString().slice(-8).toUpperCase()}</p>
                                    </td>
                                    <td className="py-4 px-5">
                                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full">
                                            {report.type || 'Dental X-Ray AI Scan'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-5">
                                        <p className="text-sm text-gray-700">
                                            {new Date(report.createdAt).toLocaleDateString('en-US', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </td>
                                    <td className="py-4 px-5">
                                        {report.uploadedBy === 'dentist' ? (
                                            <span className="flex items-center gap-1.5 text-sm text-blue-700">
                                                <ShieldCheckIcon className="w-4 h-4" />
                                                Dr. {report.dentistName || 'Dentist'}
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-sm text-emerald-700">
                                                <UserIcon className="w-4 h-4" />
                                                Patient
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-4 px-5">
                                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                                            report.totalFound > 0
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-emerald-100 text-emerald-700'
                                        }`}>
                                            {report.totalFound ?? '—'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-5">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                                            report.status === 'generated'
                                                ? 'bg-purple-100 text-purple-700'
                                                : 'bg-blue-100 text-blue-700'
                                        }`}>
                                            {report.status === 'generated'
                                                ? <ArrowDownTrayIcon className="w-3 h-3" />
                                                : <ClockIcon className="w-3 h-3" />
                                            }
                                            {report.status === 'generated' ? 'PDF Ready' : 'Saved'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-5">
                                        <button
                                            onClick={() => handleDownload(report._id, report.patientName)}
                                            disabled={report.status !== 'generated' || !report.pdfBase64}
                                            title={report.status !== 'generated' ? 'No PDF — report was only saved, not generated' : 'Download PDF'}
                                            className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            <ArrowDownTrayIcon className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer count */}
                {!loading && reports.length > 0 && (
                    <div className="px-5 py-3 border-t border-emerald-50 text-sm text-gray-400">
                        Showing {reports.length} report{reports.length !== 1 ? 's' : ''}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminAllReports;