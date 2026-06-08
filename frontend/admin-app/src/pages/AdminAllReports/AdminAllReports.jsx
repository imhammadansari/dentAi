import React, { useState } from 'react';
import {
    DocumentTextIcon, MagnifyingGlassIcon, FunnelIcon,
    CalendarDaysIcon, EyeIcon, ArrowDownTrayIcon, PrinterIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

const STATIC_REPORTS = [
    { id: 1, patientName: 'Aqdus Haider', patientId: 'PAT-0001', date: '2024-02-15', type: 'Dental X-Ray', dentist: 'Dr. Hammad Ansari', status: 'completed', findings: ['Cavity detected', 'Mild gingivitis'] },
    { id: 2, patientName: 'Maaz Ilyas', patientId: 'PAT-0002', date: '2024-03-01', type: 'Dental X-Ray', dentist: 'Dr. Faran Khalil', status: 'completed', findings: ['Healthy teeth', 'Minor tartar'] },
    { id: 3, patientName: 'Abdullah Faisal', patientId: 'PAT-0003', date: '2024-03-10', type: 'Dental X-Ray', dentist: 'Dr. Hammad Ansari', status: 'pending', findings: [] },
];

const AdminAllReports = () => {
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');

    const filtered = STATIC_REPORTS.filter(r => {
        const matchSearch =
            r.patientName.toLowerCase().includes(search.toLowerCase()) ||
            r.patientId.toLowerCase().includes(search.toLowerCase()) ||
            r.dentist.toLowerCase().includes(search.toLowerCase());
        const matchType = filterType === 'all' || r.type === filterType;
        const matchDate = dateFilter === 'all' ||
            (dateFilter === 'week' && new Date(r.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
            (dateFilter === 'month' && new Date(r.date).getMonth() === new Date().getMonth());
        return matchSearch && matchType && matchDate;
    });

    const completedCount = STATIC_REPORTS.filter(r => r.status === 'completed').length;
    const pendingCount = STATIC_REPORTS.filter(r => r.status === 'pending').length;

    return (
        <div className="p-2 lg:p-4 min-h-full space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">All Reports</h3>
                    <p className="text-emerald-600">View and manage all patient dental reports</p>
                </div>
                <span className="px-3 py-1.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                    Coming Soon — Static Data
                </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Total Reports', value: STATIC_REPORTS.length, color: 'from-emerald-500 to-green-400' },
                    { label: 'Completed', value: completedCount, color: 'from-green-500 to-emerald-400' },
                    { label: 'Pending', value: pendingCount, color: 'from-amber-400 to-orange-400' },
                ].map((c, i) => (
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
                            placeholder="Search by patient, dentist..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                    </div>
                    <div className="relative">
                        <FunnelIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <select
                            value={filterType}
                            onChange={e => setFilterType(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        >
                            <option value="all">All Types</option>
                            <option value="Dental X-Ray">Dental X-Ray</option>
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

            {/* Table */}
            <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-emerald-50">
                            <tr>
                                <th className="py-4 px-5 text-left text-sm font-semibold text-gray-700">Patient</th>
                                <th className="py-4 px-5 text-left text-sm font-semibold text-gray-700">Type</th>
                                <th className="py-4 px-5 text-left text-sm font-semibold text-gray-700">Date</th>
                                <th className="py-4 px-5 text-left text-sm font-semibold text-gray-700">Dentist</th>
                                <th className="py-4 px-5 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="py-4 px-5 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-emerald-50">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center">
                                        <DocumentTextIcon className="w-10 h-10 text-emerald-200 mx-auto mb-2" />
                                        <p className="text-gray-400">No reports found</p>
                                    </td>
                                </tr>
                            ) : filtered.map(report => (
                                <tr key={report.id} className="hover:bg-emerald-50/40 transition-colors">
                                    <td className="py-4 px-5">
                                        <p className="font-semibold text-gray-900">{report.patientName}</p>
                                        <p className="text-xs text-gray-400">{report.patientId}</p>
                                    </td>
                                    <td className="py-4 px-5">
                                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full">{report.type}</span>
                                    </td>
                                    <td className="py-4 px-5">
                                        <p className="text-sm text-gray-700">{new Date(report.date).toLocaleDateString()}</p>
                                    </td>
                                    <td className="py-4 px-5">
                                        <p className="text-sm text-gray-700">{report.dentist}</p>
                                    </td>
                                    <td className="py-4 px-5">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                                            report.status === 'completed'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-amber-100 text-amber-700'
                                        }`}>
                                            {report.status === 'pending' && <ClockIcon className="w-3 h-3" />}
                                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-5">
                                        <div className="flex gap-2">
                                            {[EyeIcon, ArrowDownTrayIcon, PrinterIcon].map((Icon, i) => (
                                                <button
                                                    key={i}
                                                    className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                                                    title={['View', 'Download', 'Print'][i]}
                                                >
                                                    <Icon className="w-4 h-4" />
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminAllReports;