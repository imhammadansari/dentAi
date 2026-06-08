import React, { useState, useEffect } from 'react';
import {
  CameraIcon, BookmarkIcon, DocumentArrowDownIcon,
  ArrowsRightLeftIcon, XMarkIcon, CheckCircleIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = 'http://localhost:8000';

const PatientUploadXray = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [preview, setPreview] = useState(null);
  const [comments, setComments] = useState('');
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [comparing, setComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  const token = localStorage.getItem('accessToken');
  const authHeader = { Authorization: `Bearer ${token}` };

  // Check if patient has previous reports (to enable Compare button)
  useEffect(() => {
    const check = async () => {
      try {
        const res = await axios.get(`${API}/api/reports/has-previous`, { headers: authHeader });
        setHasPrevious(res.data.hasPrevious);
      } catch (_) {}
    };
    check();
  }, []);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setResult(null);
    setComparisonResult(null);
    setSaved(false);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const onUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const res = await axios.post(`${API}/api/analysis/predict`, formData);
      if (res.status === 200) {
        setResult(res.data);
        setPreview(null);
        setSelectedFile(null);
        toast.success('Analysis Completed');
      }
    } catch (err) {
      toast.error('AI server connection failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReport = async () => {
    if (!result) return;
    setSaving(true);
    try {
      await axios.post(
        `${API}/api/reports/save`,
        { totalFound: result.total_found, detections: result.detections, annotatedImage: result.image, comments },
        { headers: authHeader }
      );
      setSaved(true);
      setHasPrevious(true); // now they have a report
      toast.success('Report saved successfully!');
    } catch (err) {
      toast.error('Failed to save report');
    } finally {
      setSaving(false);
    }
  };

  // Downloads PDF as a file directly from the server stream
  const downloadPdfBlob = async (endpoint, payload, filename) => {
    const res = await axios.post(endpoint, payload, {
      headers: authHeader,
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleGenerateReport = async (withComparison = false, compText = '') => {
    if (!result) return;
    setGenerating(true);
    try {
      const endpoint = withComparison
        ? `${API}/api/reports/generate-comparison`
        : `${API}/api/reports/generate`;

      const payload = {
        totalFound: result.total_found,
        detections: result.detections,
        annotatedImage: result.image,
        comments,
        ...(withComparison && { comparisonReport: compText })
      };

      const filename = withComparison
        ? `DentAI_Comparison_${new Date().toISOString().slice(0, 10)}.pdf`
        : `DentAI_Report_${new Date().toISOString().slice(0, 10)}.pdf`;

      await downloadPdfBlob(endpoint, payload, filename);
      toast.success('PDF downloaded!');
      setSaved(true);
      setHasPrevious(true);
      setShowCompareModal(false);
    } catch (err) {
      toast.error('Failed to generate PDF');
    } finally {
      setGenerating(false);
    }
  };

  const handleCompare = async () => {
    setComparing(true);
    try {
      const res = await axios.post(
        `${API}/api/reports/compare`,
        { currentScan: { totalFound: result.total_found, detections: result.detections, comments } },
        { headers: authHeader }
      );
      if (res.data.success) {
        setComparisonResult(res.data);
        setShowCompareModal(true);
      }
    } catch (err) {
      toast.error('Comparison failed');
    } finally {
      setComparing(false);
    }
  };

  return (
    <div className="lg:p-6">
      <div className="max-w-4xl mx-auto">

        {/* Upload Card */}
        <div className="bg-gradient-to-br from-white to-emerald-50 border-2 border-dashed border-emerald-200 rounded-3xl p-6 text-center mb-8">
          <div className={`${!preview ? 'w-20 h-20 lg:w-24 lg:h-24 rounded-full' : 'w-32 h-32 lg:w-52 lg:h-52'} overflow-hidden mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-emerald-100 to-green-100`}>
            {preview
              ? <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              : <CameraIcon className="w-10 h-10 text-emerald-500" />
            }
          </div>

          <h3 className="text-2xl font-bold text-emerald-900 mb-2">Upload Dental X-Ray</h3>
          <p className="text-emerald-600 mb-6 max-w-md mx-auto text-sm lg:text-base">
            Upload panoramic, bitewing, or periapical X-rays. Our AI will analyze and generate reports.
          </p>

          <input type="file" accept="image/*" id="xrayUpload" className="hidden" onChange={onFileChange} />

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <label htmlFor="xrayUpload" className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-400 text-white font-bold rounded-xl cursor-pointer hover:shadow-lg transition-all">
              Select File
            </label>
            <button
              onClick={onUpload}
              disabled={!selectedFile || loading}
              className={`px-8 py-3 font-bold rounded-xl transition-all ${loading ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-emerald-700 text-white hover:bg-emerald-800'}`}
            >
              {loading ? 'Analyzing...' : 'Start AI Scan'}
            </button>
          </div>

          {selectedFile && <p className="mt-3 text-sm text-emerald-600">Selected: {selectedFile.name}</p>}
          <p className="text-xs text-emerald-400 mt-3">Supports JPG, PNG, DICOM • Max 50MB</p>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white rounded-2xl border border-emerald-100 shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-green-400 p-5">
              <h3 className="text-xl font-bold text-white">
                AI Scan Result — {result.total_found} Issue{result.total_found !== 1 ? 's' : ''} Detected
              </h3>
              <p className="text-emerald-100 text-sm mt-1">Review findings, add comments, then save or generate your report</p>
            </div>

            <div className="p-6">
              {result.image && (
                <div className="text-center mb-6">
                  <img
                    src={`data:image/jpeg;base64,${result.image}`}
                    alt="AI Result"
                    className="mx-auto rounded-xl shadow-lg max-w-full border-2 border-emerald-100"
                  />
                </div>
              )}

              <div className="grid gap-3 mb-6">
                {result.detections?.map((d, i) => (
                  <div key={i} className="p-4 border-l-4 border-emerald-500 bg-emerald-50 rounded-lg">
                    <div className="font-bold text-emerald-800 mb-1 capitalize">{d.stage?.replace(/_/g, ' ')}</div>
                    <p className="text-sm text-gray-700"><b>Diagnosis:</b> {d.explanation}</p>
                    <p className="text-sm text-gray-500"><b>Confidence:</b> {d.confidence}</p>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-emerald-800 mb-2">
                  Add Comments / Notes (optional)
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={3}
                  placeholder="E.g. Patient reported sensitivity in lower left molar..."
                  className="w-full border border-emerald-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none"
                />
              </div>

              {saved && (
                <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
                  <CheckCircleIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">Report saved — visible in your Reports page</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Save Report */}
                <button
                  onClick={handleSaveReport}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-50 border-2 border-emerald-300 text-emerald-700 font-semibold rounded-xl hover:bg-emerald-100 transition-all disabled:opacity-50"
                >
                  <BookmarkIcon className="w-5 h-5" />
                  {saving ? 'Saving...' : 'Save Report'}
                </button>

                {/* Generate Report → downloads PDF */}
                <button
                  onClick={() => handleGenerateReport(false)}
                  disabled={generating}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-all disabled:opacity-50"
                >
                  <DocumentArrowDownIcon className="w-5 h-5" />
                  {generating ? 'Generating...' : 'Generate Report'}
                </button>

                {/* Compare — only active if patient has a previous report */}
                <button
                  onClick={handleCompare}
                  disabled={comparing || !hasPrevious}
                  title={!hasPrevious ? 'No previous report to compare with' : 'Compare with your last report'}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 font-semibold rounded-xl transition-all
                    ${!hasPrevious
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
                      : 'bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50'
                    }`}
                >
                  <ArrowsRightLeftIcon className="w-5 h-5" />
                  {comparing ? 'Comparing...' : 'Compare with Last'}
                </button>
              </div>

              {!hasPrevious && (
                <p className="text-xs text-gray-400 text-center mt-2">
                  "Compare with Last" activates after you save or generate your first report
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Comparison Modal */}
      {showCompareModal && comparisonResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-5 rounded-t-2xl flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">AI Comparison Analysis</h3>
                <p className="text-blue-100 text-sm">
                  vs. report from {new Date(comparisonResult.previousReport?.date).toLocaleDateString()}
                </p>
              </div>
              <button onClick={() => setShowCompareModal(false)} className="text-white hover:text-blue-200">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex gap-4 mb-5">
                <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Previous Issues</p>
                  <p className="text-2xl font-bold text-gray-700">{comparisonResult.previousReport?.totalFound}</p>
                </div>
                <div className="flex items-center text-gray-400 font-bold text-xl">→</div>
                <div className="flex-1 bg-emerald-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-emerald-600 mb-1">Current Issues</p>
                  <p className="text-2xl font-bold text-emerald-700">{result?.total_found}</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5">
                <p className="text-sm font-semibold text-blue-700 mb-2">Comparison Analysis:</p>
                <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{comparisonResult.comparison}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleGenerateReport(true, comparisonResult.comparison)}
                  disabled={generating}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-all disabled:opacity-50"
                >
                  <DocumentArrowDownIcon className="w-5 h-5" />
                  {generating ? 'Generating...' : 'Download Comparison PDF'}
                </button>
                <button
                  onClick={() => setShowCompareModal(false)}
                  className="px-5 py-3 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientUploadXray;