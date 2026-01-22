import React from 'react';
import {
  DocumentTextIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  ChartBarIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const mockReports = [
  { id: 1, date: '2024-02-15', type: 'Dental Scan', status: 'completed', findings: ['Cavity detected'] },
  { id: 3, date: '2024-01-10', type: 'Panoramic X-Ray', status: 'pending', findings: [] },
];

const mockConsultations = [
  { id: 1, date: '2024-02-20', time: '10:30 AM', dentist: 'Dr. Arham', status: 'upcoming' },
];

const PatientDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-white to-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-600 font-medium">Total Reports</p>
              <h3 className="text-3xl font-bold text-emerald-900 mt-2">12</h3>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <DocumentTextIcon className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-emerald-600">
            <CheckCircleIcon className="w-4 h-4 mr-1" />
            <span>2 new this month</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-600 font-medium">Consultations</p>
              <h3 className="text-3xl font-bold text-emerald-900 mt-2">8</h3>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <CalendarDaysIcon className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-emerald-600">
            <ClockIcon className="w-4 h-4 mr-1" />
            <span>1 upcoming</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-600 font-medium">AI Analysis</p>
              <h3 className="text-3xl font-bold text-emerald-900 mt-2">94%</h3>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <p className="text-sm text-emerald-600 mt-4">Accuracy rate</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-emerald-900">Recent Reports</h3>
          <button className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
            View All <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-4">
          {mockReports.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-xl hover:bg-emerald-50 transition-all">
              <div>
                <h4 className="font-semibold text-emerald-900">{report.type}</h4>
                <p className="text-sm text-emerald-600">{new Date(report.date).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-4">
                {report.findings.slice(0, 2).map((finding, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white text-emerald-700 text-sm rounded-full border border-emerald-200">
                    {finding}
                  </span>
                ))}
                <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-100 p-6 shadow-sm">
        <h3 className="text-xl font-bold text-emerald-900 mb-6">Upcoming Consultation</h3>
        {mockConsultations.filter(c => c.status === 'upcoming').map((consultation) => (
          <div key={consultation.id} className="flex items-center justify-between p-6 bg-white rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-400 rounded-xl flex items-center justify-center">
                <CalendarDaysIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-emerald-900 text-lg">With {consultation.dentist}</h4>
                <p className="text-emerald-600">
                  {new Date(consultation.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} at {consultation.time}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-emerald-500 text-white font-medium rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-200">
                Chat
              </button>
              <button className="px-6 py-3 border-2 border-emerald-200 text-emerald-700 font-medium rounded-xl hover:bg-white transition-colors">
                Reschedule
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientDashboard;