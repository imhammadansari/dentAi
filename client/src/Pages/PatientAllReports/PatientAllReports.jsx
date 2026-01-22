import React from 'react';
import { DocumentTextIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const mockReports = [
    { id: 1, date: '2024-02-15', type: 'Dental Scan', status: 'completed', findings: ['Cavity detected', 'Mild gingivitis'] },
    { id: 2, date: '2024-01-28', type: 'Full Mouth X-Ray', status: 'completed', findings: ['Wisdom tooth impacted', 'No cavities'] },
    { id: 3, date: '2024-01-10', type: 'Panoramic X-Ray', status: 'pending', findings: [] },
];

const PatientAllReports = () => {
    return (
        <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-emerald-900">All Reports</h3>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium">All</button>
                                <button className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg font-medium">Recent</button>
                                <button className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg font-medium">Pending</button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {mockReports.map((report) => (
                                <div key={report.id} className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${report.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                                            }`}>
                                            {report.status === 'completed' ?
                                                <CheckCircleIcon className="w-5 h-5" /> :
                                                <ClockIcon className="w-5 h-5" />
                                            }
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-emerald-900">{report.type}</h4>
                                            <p className="text-sm text-emerald-600">{report.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${report.status === 'completed'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {report.status}
                                        </span>
                                        <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors">
                                            Generate Report
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-100 p-6">
                        <h4 className="font-bold text-emerald-900 mb-4">Report Insights</h4>
                        <div className="space-y-3">
                            {['Dental Caries', 'Gingivitis', 'Impacted Teeth', 'Bone Loss'].map((insight, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                    <span className="text-emerald-700">{insight}</span>
                                    <span className="font-bold text-emerald-900">{Math.floor(Math.random() * 5)} detected</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl border border-emerald-100 p-6">
                        <h4 className="font-bold text-emerald-900 mb-4">Quick Actions</h4>
                        <div className="space-y-3">
                            <button className="w-full py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors">
                                Generate New Report
                            </button>
                            <button className="w-full py-3 bg-white border-2 border-emerald-200 text-emerald-700 rounded-lg font-medium hover:bg-emerald-50 transition-colors">
                                Download All Reports
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientAllReports;