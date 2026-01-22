// Components/Header/PatientHeader.jsx
import React from 'react';
import { BellIcon } from '@heroicons/react/24/outline';

const PatientHeader = ({ activeTab, userData }) => {
    const user = userData || { name: 'Patient User' };

    const getHeaderInfo = () => {
        switch (activeTab) {
            case 'home': return { title: `Welcome Back, ${user.name}!`, subtitle: 'Your dental health overview' };
            case 'upload': return { title: 'Upload Dental X-Ray', subtitle: 'Upload and analyze your dental scans' };
            case 'reports': return { title: 'All Reports', subtitle: 'View and manage all reports' };
            case 'book': return { title: 'Book Consultation', subtitle: 'Schedule your next appointment' };
            case 'consultations': return { title: 'My Consultations', subtitle: 'Track your consultation history' };
            default: return { title: 'Dashboard', subtitle: 'Your dental health overview' };
        }
    };

    const headerInfo = getHeaderInfo();

    return (
        <div className="bg-white border-b border-emerald-100 p-6 flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-emerald-900">{headerInfo.title}</h2>
                <p className="text-emerald-600 mt-1">{headerInfo.subtitle}</p>
            </div>
            <div className="flex items-center gap-4">
                <button className="relative p-2 text-emerald-700 hover:bg-emerald-50 rounded-xl">
                    <BellIcon className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        3
                    </span>
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-400 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-right">
                        <p className="font-medium text-emerald-900">{user.name}</p>
                        <p className="text-sm text-emerald-600">Patient</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientHeader;