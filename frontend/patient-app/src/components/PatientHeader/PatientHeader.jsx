import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheckIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { IoMenuSharp } from "react-icons/io5";
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const PatientHeader = ({ activeTab, userData, toggleSidebar }) => {
    const user = userData || { name: 'Patient User' };
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { handleLogout } = useAuth();
    const navigate = useNavigate();

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

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="bg-white border-b border-emerald-100 p-4 lg:p-6 flex justify-between items-center">
            <div className='hidden lg:block'>
                <h2 className="text-[16px] lg:text-2xl font-bold text-emerald-900">{headerInfo.title}</h2>
                <p className="text-emerald-600 mt-1">{headerInfo.subtitle}</p>
            </div>

            <Link to='/' className='flex lg:hidden gap-2 items-center'>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}>
                    <ShieldCheckIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: '#14532d' }}>
                        Dent<span style={{ color: '#22c55e' }}>AI</span>
                    </h1>
                    <p className="text-xs font-medium" style={{ color: '#16a34a' }}>Patient Portal</p>
                </div>
            </Link>

            <div className="flex items-center gap-4">
                <div className="hidden lg:flex items-center gap-3 relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-3 focus:outline-none"
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-400 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-emerald-900">{user.name}</p>
                            <p className="text-sm text-emerald-600">Patient</p>
                        </div>
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 top-12 w-44 bg-white border border-emerald-100 rounded-xl shadow-lg z-50 overflow-hidden">
                            <button
                                onClick={() => { setDropdownOpen(false); navigate('/patient-dashboard/account') }}
                                className="w-full flex items-center gap-2 px-4 py-3 text-emerald-800 hover:bg-emerald-50 transition-colors text-sm font-medium"
                            >
                                <UserCircleIcon className="w-4 h-4" />
                                Account
                            </button>
                            <div className="border-t border-emerald-100" />
                            <button
                                onClick={() => { setDropdownOpen(false); handleLogout(); }}
                                className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    )}
                </div>

                <div className='lg:hidden'>
                    <IoMenuSharp onClick={toggleSidebar} className='w-8 h-8 text-emerald-900 cursor-pointer' />
                </div>
            </div>
        </div>
    );
};

export default PatientHeader;