import React from 'react';
import { CameraIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const PatientUploadXray = () => {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-white to-emerald-50 border-2 border-dashed border-emerald-200 rounded-3xl p-12 text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CameraIcon className="w-12 h-12 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-bold text-emerald-900 mb-3">Upload Dental X-Ray</h3>
          <p className="text-emerald-600 mb-8 max-w-md mx-auto">
            Upload panoramic, bitewing, or periapical X-rays. Our AI will analyze and generate comprehensive reports.
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-400 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-200 transition-all text-lg">
            Select Files
          </button>
          <p className="text-sm text-emerald-500 mt-4">Supports JPG, PNG, DICOM • Max 50MB</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Panoramic', 'Bitewing', 'Periapical'].map((type) => (
            <div key={type} className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                <DocumentTextIcon className="w-6 h-6 text-emerald-600" />
              </div>
              <h4 className="font-bold text-emerald-900 mb-2">{type} X-Ray</h4>
              <p className="text-sm text-emerald-600 mb-4">Upload {type.toLowerCase()} dental images</p>
              <button className="w-full py-3 bg-emerald-50 text-emerald-700 font-medium rounded-lg hover:bg-emerald-100 transition-colors">
                Upload Sample
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientUploadXray;