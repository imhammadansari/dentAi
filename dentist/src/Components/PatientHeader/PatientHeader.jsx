import React, { useState } from 'react';
import { BellIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { IoMenuSharp } from "react-icons/io5";
import PatientSidebar from '../PatientSidebar/PatientSidebar';

const PatientHeader = ({ activeTab, userData, toggleSidebar }) => {
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
        <>
            <div className="bg-white border-b border-emerald-100 p-4 lg:p-6 flex justify-between items-center">
                <div className='hidden lg:block'>
                    <h2 className="text-[16px] lg:text-2xl font-bold text-emerald-900">{headerInfo.title}</h2>
                    <p className="text-emerald-600 mt-1">{headerInfo.subtitle}</p>
                </div>

                <div className='flex lg:hidden gap-2 items-center'>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center lg:hidden" style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}>
                        <ShieldCheckIcon className="w-6 h-6 text-white cusror-pointer" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: '#14532d' }}>
                            Dent<span style={{ color: '#22c55e' }}>AI</span>
                        </h1>
                        <p className="text-xs font-medium" style={{ color: '#16a34a' }}>Patient Portal</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="hidden lg:block relative p-2 text-emerald-700 hover:bg-emerald-50 rounded-xl">
                        <BellIcon className="w-6 h-6" />
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            3
                        </span>
                    </button>
                    <div className="hidden lg:flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-400 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-right">
                            <p className="font-medium text-emerald-900">{user.name}</p>
                            <p className="text-sm text-emerald-600">Patient</p>
                        </div>
                    </div>

                    <div className='lg:hidden'>
                        <IoMenuSharp onClick={toggleSidebar} className='w-8 h-8 text-emerald-900 cusror-pointer' />
                    </div>
                </div>
            </div>


        </>
    );
};

export default PatientHeader;