import React, { useState } from 'react';
import { CameraIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';

const PatientUploadXray = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [preview, setPreview] = useState(null);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setResult(null);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };


  const onUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await axios.post(
        'http://localhost:8000/api/analysis/predict',
        formData
      );

      if (res.status === 200) {
        setResult(res.data);
        setPreview(null);
        setSelectedFile(null);
        toast.success("Analysis Completed");

      }
    } catch (err) {
      console.error(err);
      alert(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="p-2 lg:p-6">
      <div className="max-w-4xl mx-auto">

        <div className="bg-gradient-to-br from-white to-emerald-50 border-2 border-dashed border-emerald-200 rounded-3xl p-4 text-center mb-8">
          <div className={`${!preview ? 'w-20 h-20 lg:w-24 lg:h-24 rounded-full' : 'w-24 h-24 lg:w-48 lg:h-48'} overflow-hidden mx-auto mb-3 lg:mb-6 flex items-center justify-center bg-gradient-to-br from-emerald-100 to-green-100`}>

            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <CameraIcon className="w-9 h-9 lg:w-12 lg:h-12 text-emerald-500" />
            )}

          </div>


          <h3 className="text-2xl font-bold text-emerald-900 mb-1 lg:mb-3">Upload Dental X-Ray</h3>

          <p className="text-emerald-600 mb-6 max-w-md mx-auto text-[14px] lg:text-[16px]">
            Upload panoramic, bitewing, or periapical X-rays. Our AI will analyze and generate reports.
          </p>

          <input
            type="file"
            accept="image/*"
            id="xrayUpload"
            className="hidden"
            onChange={onFileChange}
          />

          <div className="flex flex-col lg:flex-row justify-center gap-4">
            <label
              htmlFor="xrayUpload"
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-400 text-white font-bold rounded-xl cursor-pointer hover:shadow-lg hover:shadow-emerald-200 transition-all text-lg"
            >
              Select File
            </label>

            <button
              onClick={onUpload}
              disabled={!selectedFile || loading}
              className={`px-8 py-4 font-bold rounded-xl text-lg transition-all
                ${loading
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'}
              `}
            >
              {loading ? "Analyzing..." : "Start AI Scan"}
            </button>
          </div>

          {selectedFile && (
            <p className="mt-4 text-sm text-emerald-600">
              Selected: {selectedFile.name}
            </p>
          )}

          <p className="text-sm text-emerald-500 mt-4">
            Supports JPG, PNG, DICOM • Max 50MB
          </p>
        </div>

        {result && (
          <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-md">
            <h3 className="text-xl font-bold text-emerald-800 mb-4">
              AI Scan Result — {result.total_found} Issues Detected
            </h3>

            {result.image && (
              <div className="text-center mb-6">
                <img
                  src={`data:image/jpeg;base64,${result.image}`}
                  alt="AI Result"
                  className="mx-auto rounded-xl shadow-lg max-w-full"
                />
              </div>
            )}

            <div className="grid gap-4">
              {result.detections?.map((d, i) => (
                <div
                  key={i}
                  className="p-4 border-l-4 border-emerald-500 bg-emerald-50 rounded-lg"
                >
                  <div className="font-bold text-emerald-800 mb-1">
                    {d.stage.replace('_', ' ')}
                  </div>
                  <p className="text-sm"><b>Diagnosis:</b> {d.explanation}</p>
                  <p className="text-sm"><b>Confidence:</b> {d.confidence}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PatientUploadXray;
