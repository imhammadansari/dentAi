import React, { useState } from 'react';
import {
    CameraIcon, BookmarkIcon, CheckCircleIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_SERVER_URL || 'https://13.51.175.156.nip.io';

const DentistUploadXRay = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [preview, setPreview] = useState(null);
    const [comments, setComments] = useState('');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const token = localStorage.getItem('accessToken');
    const authHeader = { Authorization: `Bearer ${token}` };

    const onFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setResult(null);
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
                {
                    totalFound: result.total_found,
                    detections: result.detections,
                    annotatedImage: result.image,
                    comments
                },
                { headers: authHeader }
            );
            setSaved(true);
            toast.success('Report saved successfully!');
        } catch (err) {
            toast.error('Failed to save report');
        } finally {
            setSaving(false);
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
                        Upload panoramic, bitewing, or periapical X-rays. Our AI will analyze and generate a report.
                    </p>

                    <input type="file" accept="image/*" id="xrayUpload" className="hidden" onChange={onFileChange} />

                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                        <label
                            htmlFor="xrayUpload"
                            className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-400 text-white font-bold rounded-xl cursor-pointer hover:shadow-lg transition-all"
                        >
                            Select File
                        </label>
                        <button
                            onClick={onUpload}
                            disabled={!selectedFile || loading}
                            className={`px-8 py-3 font-bold rounded-xl transition-all ${loading
                                    ? 'bg-gray-400 text-white cursor-not-allowed'
                                    : 'bg-emerald-700 text-white hover:bg-emerald-800'
                                }`}
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
                            <p className="text-emerald-100 text-sm mt-1">Review findings, add notes, then save the report</p>
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
                                        {/* <p className="text-sm text-gray-500"><b>Confidence:</b> {d.confidence}</p> */}
                                    </div>
                                ))}
                            </div>

                            {/* <div className="mb-6">
                                <label className="block text-sm font-semibold text-emerald-800 mb-2">
                                    Add Recommendations / Comments (optional)
                                </label>
                                <textarea
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                    rows={3}
                                    placeholder="E.g. Patient reported sensitivity in lower left molar..."
                                    className="w-full border border-emerald-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none"
                                />
                            </div> */}

                            {saved && (
                                <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
                                    <CheckCircleIcon className="w-5 h-5" />
                                    <span className="text-sm font-medium">Report saved successfully</span>
                                </div>
                            )}

                            {/* <button
                                onClick={handleSaveReport}
                                disabled={saving || saved}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-all disabled:opacity-50"
                            >
                                <BookmarkIcon className="w-5 h-5" />
                                {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Report'}
                            </button> */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DentistUploadXRay;