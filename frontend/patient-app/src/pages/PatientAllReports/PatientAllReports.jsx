import React, { useEffect, useState } from 'react';
import {
  DocumentTextIcon, BookmarkIcon, ArrowDownTrayIcon,
  CalendarDaysIcon, ExclamationCircleIcon, MagnifyingGlassIcon,
  FunnelIcon, ChartBarIcon, CheckCircleIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = 'http://localhost:8000';

const PatientAllReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [downloading, setDownloading] = useState(null); // report id being downloaded

  const token = localStorage.getItem('accessToken');
  const authHeader = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(`${API}/api/reports/my`, { headers: authHeader });
        if (res.data.success) setReports(res.data.data);
      } catch (err) {
        toast.error('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const filtered = reports.filter(r => {
    if (filter === 'generated') return r.status === 'generated';
    if (filter === 'saved') return r.status === 'saved';
    return true;
  });

  const stats = {
    total: reports.length,
    generated: reports.filter(r => r.status === 'generated').length,
    totalIssues: reports.reduce((sum, r) => sum + (r.totalFound || 0), 0),
  };

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
      toast.success('PDF downloaded!');
    } catch (err) {
      toast.error('Failed to download report');
    } finally {
      setDownloading(null);
    }
  };

  const severityColor = (total) => {
    if (total === 0) return 'text-green-600';
    if (total <= 2) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="lg:p-4">

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-700">{stats.total}</p>
          <p className="text-xs text-emerald-500 mt-1">Total Reports</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-700">{stats.generated}</p>
          <p className="text-xs text-blue-500 mt-1">PDFs Generated</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{stats.totalIssues}</p>
          <p className="text-xs text-red-400 mt-1">Total Issues Found</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Reports List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm">

            {/* Header + Filter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-3">
              <h3 className="text-xl font-bold text-emerald-900">My Reports</h3>
              <div className="flex items-center gap-2">
                <FunnelIcon className="w-4 h-4 text-emerald-400" />
                {['all', 'generated', 'saved'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                      filter === f
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-emerald-50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <DocumentTextIcon className="w-14 h-14 text-emerald-200 mx-auto mb-3" />
                <p className="text-emerald-700 font-semibold">No reports yet</p>
                <p className="text-sm text-emerald-400 mt-1 max-w-xs mx-auto">
                  Upload an X-ray on the Upload page to create your first report
                </p>
                <a
                  href="/patient-dashboard/upload"
                  className="inline-block mt-4 px-5 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-all"
                >
                  Upload X-Ray
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((report) => (
                  <div
                    key={report._id}
                    className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 hover:border-emerald-300 hover:shadow-sm transition-all"
                  >
                    {/* Left: icon + info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        report.status === 'generated' ? 'bg-blue-100' : 'bg-emerald-100'
                      }`}>
                        {report.status === 'generated'
                          ? <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                          : <BookmarkIcon className="w-5 h-5 text-emerald-600" />
                        }
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-emerald-900 text-sm truncate">{report.type}</h4>
                        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                          <div className="flex items-center gap-1">
                            <CalendarDaysIcon className="w-3 h-3 text-emerald-400" />
                            <span className="text-xs text-emerald-500">
                              {new Date(report.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'short', day: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ExclamationCircleIcon className={`w-3 h-3 ${severityColor(report.totalFound)}`} />
                            <span className={`text-xs font-semibold ${severityColor(report.totalFound)}`}>
                              {report.totalFound} issue{report.totalFound !== 1 ? 's' : ''}
                            </span>
                          </div>
                          {report.comparisonReport && (
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                              Comparison
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: status badge + download */}
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span className={`hidden sm:inline px-2 py-1 rounded-full text-xs font-medium ${
                        report.status === 'generated'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {report.status.toUpperCase()}
                      </span>

                      <button
                        onClick={() => handleDownload(report._id)}
                        disabled={downloading === report._id}
                        className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500 text-white rounded-lg text-xs font-semibold hover:bg-emerald-600 transition-all disabled:opacity-60"
                      >
                        {downloading === report._id ? (
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <ArrowDownTrayIcon className="w-4 h-4" />
                        )}
                        <span className="hidden sm:inline">
                          {downloading === report._id ? 'Downloading...' : 'Download PDF'}
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">

          {/* Insights */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <ChartBarIcon className="w-5 h-5 text-emerald-600" />
              <h4 className="font-bold text-emerald-900">Report Insights</h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-emerald-700">Reports with PDFs</span>
                <span className="font-bold text-emerald-900">{stats.generated}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-emerald-700">Saved only</span>
                <span className="font-bold text-emerald-900">{stats.total - stats.generated}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-emerald-700">Total issues detected</span>
                <span className={`font-bold ${stats.totalIssues > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {stats.totalIssues}
                </span>
              </div>
              {reports.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-emerald-700">Latest scan</span>
                  <span className="font-bold text-emerald-900 text-xs">
                    {new Date(reports[0].createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              )}
              {stats.totalIssues === 0 && stats.total > 0 && (
                <div className="flex items-center gap-2 mt-2 bg-green-100 rounded-lg p-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-xs text-green-700 font-medium">Great dental health!</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-emerald-100 p-5">
            <h4 className="font-bold text-emerald-900 mb-3">Quick Actions</h4>
            <div className="space-y-3">
              <a
                href="/patient-dashboard/upload"
                className="block w-full py-3 text-center bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-all text-sm"
              >
                + New X-Ray Analysis
              </a>
            </div>
          </div>

          {/* Latest comparison snippet */}
          {reports.length > 0 && reports[0].comparisonReport && (
            <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5">
              <h4 className="font-bold text-blue-900 mb-2 text-sm">Latest AI Comparison</h4>
              <p className="text-xs text-blue-700 leading-relaxed line-clamp-5">
                {reports[0].comparisonReport}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientAllReports;