import React, { useState } from 'react';
import {
    DocumentTextIcon,
    FunnelIcon,
    EyeIcon,
    PrinterIcon,
    CalendarDaysIcon,
    UserGroupIcon,
    ChartBarIcon,
    ArrowDownTrayIcon as DownloadIcon,
} from '@heroicons/react/24/outline';

const AdminAllReports = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');

    const reports = [
        {
            id: 1,
            patientId: 'PAT-0001',
            patientName: 'Aqdus Haider',
            date: '2024-02-15',
            type: 'Dental Scan',
            dentist: 'Dr. Hammad Ansari',
            status: 'completed',
            findings: ['Cavity detected', 'Mild gingivitis'],
        }
    ];

    const filteredReports = reports.filter(report => {
        const matchesSearch = report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || report.type === filterType;
        const matchesDate = dateFilter === 'all' ||
            (dateFilter === 'today' && report.date === new Date().toISOString().split('T')[0]) ||
            (dateFilter === 'week' && new Date(report.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
            (dateFilter === 'month' && new Date(report.date).getMonth() === new Date().getMonth());

        return matchesSearch && matchesType && matchesDate;
    });

    const handleDownloadReport = (id) => {
        console.log('Downloading report:', id);
        alert(`Downloading report ${id}`);
    };

    const handlePrintReport = (id) => {
        console.log('Printing report:', id);
        window.print();
    };

    const handleViewReport = (id) => {
        console.log('Viewing report:', id);
        alert(`Viewing report ${id}`);
    };

    const generateReportTypes = () => {
        const types = [...new Set(reports.map(r => r.type))];
        return types;
    };

    const statusCounts = reports.reduce((acc, report) => {
        acc[report.status] = (acc[report.status] || 0) + 1;
        return acc;
    }, {});

    const handleExportAll = () => {
        console.log('Exporting all reports');
        alert('Exporting all reports...');
    };

    const handleViewAnalytics = () => {
        console.log('Viewing analytics');
        alert('Opening analytics dashboard...');
    };

    return (
        <div className="p-2 lg:p-4 min-h-full">
            <div className="w-full mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-2xl font-bold text-primary-900">All Reports</h3>
                        <p className="text-primary-600">View and manage all patient medical reports</p>
                    </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl border border-primary-100 p-4 shadow-sm">
                        <p className="text-primary-600 font-medium">Total Reports</p>
                        <h3 className="text-3xl font-bold text-primary-900 mt-2">{reports.length}</h3>
                    </div>
                    <div className="bg-white rounded-2xl border border-primary-100 p-4 shadow-sm">
                        <p className="text-primary-600 font-medium">Completed</p>
                        <h3 className="text-3xl font-bold text-primary-900 mt-2">{statusCounts.completed || 0}</h3>
                    </div>
                    <div className="bg-white rounded-2xl border border-primary-100 p-4 shadow-sm">
                        <p className="text-primary-600 font-medium">Pending</p>
                        <h3 className="text-3xl font-bold text-primary-900 mt-2">{statusCounts.pending || 0}</h3>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-primary-100 p-4 shadow-sm mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-primary-700 mb-2">
                                Search Reports
                            </label>
                            <div className="relative">
                                <DocumentTextIcon className="w-5 h-5 text-primary-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search by patient name, ID, or type..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-primary-50 border border-primary-100 rounded-lg text-primary-900 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-primary-700 mb-2">
                                Report Type
                            </label>
                            <div className="relative">
                                <FunnelIcon className="w-5 h-5 text-primary-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="w-full pl-10 pr-8 py-3 bg-primary-50 border border-primary-100 rounded-lg text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                    <option value="all">All Types</option>
                                    {generateReportTypes().map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-primary-700 mb-2">
                                Date Range
                            </label>
                            <div className="relative">
                                <CalendarDaysIcon className="w-5 h-5 text-primary-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <select
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                    className="w-full pl-10 pr-8 py-3 bg-primary-50 border border-primary-100 rounded-lg text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                    <option value="all">All Time</option>
                                    <option value="today">Today</option>
                                    <option value="week">Last 7 Days</option>
                                    <option value="month">This Month</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-primary-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-primary-50">
                                <tr>
                                    <th className="py-4 px-6 text-left text-sm font-semibold text-primary-900">Patient</th>
                                    <th className="py-4 px-6 text-left text-sm font-semibold text-primary-900">Report Type</th>
                                    <th className="py-4 px-6 text-left text-sm font-semibold text-primary-900">Date</th>
                                    <th className="py-4 px-6 text-left text-sm font-semibold text-primary-900">Dentist</th>
                                    <th className="py-4 px-6 text-left text-sm font-semibold text-primary-900">Status</th>
                                    <th className="py-4 px-6 text-left text-sm font-semibold text-primary-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary-100">
                                {filteredReports.map((report) => (
                                    <tr key={report.id} className="hover:bg-primary-50/50">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <h4 className="font-semibold text-primary-900">{report.patientName}</h4>
                                                    <p className="text-sm text-primary-600">{report.patientId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <span className="text-primary-700">{report.type}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-primary-700">{new Date(report.date).toLocaleDateString()}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-primary-700">{report.dentist}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${report.status === 'completed'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {report.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleDownloadReport(report.id)}
                                                    className="p-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
                                                    title="Download"
                                                >
                                                    <DownloadIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleViewReport(report.id)}
                                                    className="p-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
                                                    title="View"
                                                >
                                                    <EyeIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handlePrintReport(report.id)}
                                                    className="p-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
                                                    title="Print"
                                                >
                                                    <PrinterIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredReports.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <DocumentTextIcon className="w-12 h-12 text-primary-400" />
                            </div>
                            <h4 className="text-xl font-bold text-primary-900 mb-2">No reports found</h4>
                            <p className="text-primary-600">Try adjusting your search or filter criteria</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AdminAllReports;