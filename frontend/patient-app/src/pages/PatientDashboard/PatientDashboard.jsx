import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/bookings/my-consultations`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setConsultations(res.data.data || []);
      } catch (err) {
        console.log('fetchConsultations error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchConsultations();
  }, []);

  const totalConsultations = consultations.length;
  const upcomingConsultations = consultations.filter(
    c => c.status?.toLowerCase() === 'booked'
  );

  return (
    <div className="p-2 lg:p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-white to-emerald-50 p-4 rounded-2xl border border-emerald-100 shadow-sm">
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

        <div className="bg-gradient-to-br from-white to-emerald-50 p-4 rounded-2xl border border-emerald-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-600 font-medium">Consultations</p>
              <h3 className="text-3xl font-bold text-emerald-900 mt-2">
                {loading ? '—' : totalConsultations}
              </h3>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <CalendarDaysIcon className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-emerald-600">
            <ClockIcon className="w-4 h-4 mr-1" />
            <span>
              {loading ? '...' : `${upcomingConsultations.length} upcoming`}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-emerald-50 p-4 rounded-2xl border border-emerald-100 shadow-sm">
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

      <div className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm">
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
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-100 p-4 shadow-sm">
        <h3 className="text-xl font-bold text-emerald-900 mb-4">Upcoming Consultations</h3>

        {loading ? (
          <div className="text-center py-8 text-emerald-500">Loading...</div>
        ) : upcomingConsultations.length === 0 ? (
          <div className="text-center py-8 text-emerald-500">No upcoming consultations</div>
        ) : (
          <div className="space-y-3">
            {upcomingConsultations.map((consultation) => (
              <div
                key={consultation.id}
                onClick={() => navigate(`/patient-dashboard/consultation/${consultation.id}`)}
                className="flex items-center gap-4 p-5 bg-white rounded-xl shadow-sm cursor-pointer hover:shadow-md hover:bg-emerald-50/40 transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-400 rounded-xl flex items-center justify-center shrink-0">
                  <CalendarDaysIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-emerald-900">With {consultation.dentist || 'Your Dentist'}</h4>
                  <p className="text-emerald-600 text-sm">
                    {consultation.date} &nbsp;·&nbsp; {consultation.time}
                  </p>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-emerald-400 shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;