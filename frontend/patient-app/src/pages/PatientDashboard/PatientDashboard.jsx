import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  DocumentTextIcon, CalendarDaysIcon, CheckCircleIcon,
  ClockIcon, ChartBarIcon, ChevronRightIcon,
  ExclamationCircleIcon, BookmarkIcon, ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

const API = 'http://localhost:8000';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [reports, setReports] = useState([]);
  const [loadingConsult, setLoadingConsult] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);
  const [downloading, setDownloading] = useState(null);

  const token = localStorage.getItem('accessToken');
  const authHeader = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    // Fetch consultations
    const fetchConsultations = async () => {
      try {
        const res = await axios.get(`${API}/api/bookings/my-consultations`, { headers: authHeader });
        setConsultations(res.data.data || []);
      } catch (err) {
        console.log('fetchConsultations error:', err.message);
      } finally {
        setLoadingConsult(false);
      }
    };

    // Fetch reports
    const fetchReports = async () => {
      try {
        const res = await axios.get(`${API}/api/reports/my`, { headers: authHeader });
        if (res.data.success) setReports(res.data.data || []);
      } catch (err) {
        console.log('fetchReports error:', err.message);
      } finally {
        setLoadingReports(false);
      }
    };

    fetchConsultations();
    fetchReports();
  }, []);

  const totalConsultations = consultations.length;
  const upcomingConsultations = consultations.filter(c => c.status?.toLowerCase() === 'booked');
  const thisMonthReports = reports.filter(r => {
    const d = new Date(r.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const handleDownload = async (reportId) => {
    setDownloading(reportId);
    try {
      const res = await axios.get(`${API}/api/reports/download/${reportId}`, {
        headers: authHeader,
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `DentAI_Report_${reportId.slice(-6).toUpperCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.log('Download error:', err.message);
    } finally {
      setDownloading(null);
    }
  };

  const severityColor = (total) => {
    if (total === 0) return 'text-green-600 bg-green-50';
    if (total <= 2) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="lg:p-4 space-y-6">

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Reports */}
        <div className="bg-gradient-to-br from-white to-emerald-50 p-4 rounded-2xl border border-emerald-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-600 font-medium">Total Reports</p>
              <h3 className="text-3xl font-bold text-emerald-900 mt-2">
                {loadingReports ? '—' : reports.length}
              </h3>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <DocumentTextIcon className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-emerald-600">
            <CheckCircleIcon className="w-4 h-4 mr-1" />
            <span>
              {loadingReports ? '...' : `${thisMonthReports.length} this month`}
            </span>
          </div>
        </div>

        {/* Consultations */}
        <div className="bg-gradient-to-br from-white to-emerald-50 p-4 rounded-2xl border border-emerald-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-600 font-medium">Consultations</p>
              <h3 className="text-3xl font-bold text-emerald-900 mt-2">
                {loadingConsult ? '—' : totalConsultations}
              </h3>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <CalendarDaysIcon className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-emerald-600">
            <ClockIcon className="w-4 h-4 mr-1" />
            <span>{loadingConsult ? '...' : `${upcomingConsultations.length} upcoming`}</span>
          </div>
        </div>

        {/* Issues Found */}
        <div className="bg-gradient-to-br from-white to-emerald-50 p-4 rounded-2xl border border-emerald-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-600 font-medium">Issues Detected</p>
              <h3 className="text-3xl font-bold text-emerald-900 mt-2">
                {loadingReports ? '—' : reports.reduce((s, r) => s + (r.totalFound || 0), 0)}
              </h3>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
          <p className="text-sm text-emerald-600 mt-4">Across all scans</p>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold text-emerald-900">Recent Reports</h3>
          <button
            onClick={() => navigate('/patient-dashboard/reports')}
            className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 text-sm"
          >
            View All <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>

        {loadingReports ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-emerald-50 rounded-xl animate-pulse" />)}
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-10">
            <DocumentTextIcon className="w-12 h-12 text-emerald-200 mx-auto mb-2" />
            <p className="text-emerald-600 font-medium">No reports yet</p>
            <button
              onClick={() => navigate('/patient-dashboard/upload')}
              className="mt-3 px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-all"
            >
              Upload X-Ray
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.slice(0, 4).map((report) => (
              <div key={report._id} className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 hover:border-emerald-200 transition-all">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${report.status === 'generated' ? 'bg-blue-100' : 'bg-emerald-100'}`}>
                    {report.status === 'generated'
                      ? <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                      : <BookmarkIcon className="w-5 h-5 text-emerald-600" />
                    }
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-emerald-900 text-sm truncate">{report.type}</h4>
                    <p className="text-xs text-emerald-500 mt-0.5">
                      {new Date(report.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span className={`hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${severityColor(report.totalFound)}`}>
                    <ExclamationCircleIcon className="w-3 h-3" />
                    {report.totalFound} issue{report.totalFound !== 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={() => handleDownload(report._id)}
                    disabled={downloading === report._id}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-semibold hover:bg-emerald-600 transition-all disabled:opacity-60"
                  >
                    {downloading === report._id
                      ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      : <ArrowDownTrayIcon className="w-3.5 h-3.5" />
                    }
                    <span className="hidden sm:inline">PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Consultations */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-100 p-4 shadow-sm">
        <h3 className="text-xl font-bold text-emerald-900 mb-4">Upcoming Consultations</h3>
        {loadingConsult ? (
          <div className="text-center py-8 text-emerald-500">Loading...</div>
        ) : upcomingConsultations.length === 0 ? (
          <div className="text-center py-8 text-emerald-500">No upcoming consultations</div>
        ) : (
          <div className="space-y-3">
            {upcomingConsultations.map((c) => (
              <div
                key={c._id || c.id}
                onClick={() => navigate(`/patient-dashboard/consultation/${c._id || c.id}`)}
                className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm cursor-pointer hover:shadow-md hover:bg-emerald-50/40 transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-400 rounded-xl flex items-center justify-center shrink-0">
                  <CalendarDaysIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-emerald-900">With {c.dentist || 'Your Dentist'}</h4>
                  <p className="text-emerald-600 text-sm">{c.date} &nbsp;·&nbsp; {c.time}</p>
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