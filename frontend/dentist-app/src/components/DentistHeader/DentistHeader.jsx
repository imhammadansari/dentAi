import React, { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon, ShieldCheckIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { IoMenuSharp } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DentistHeader = ({ activeTab, userData, toggleSidebar }) => {
    const user = userData || { name: 'Dentist User' };
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { handleLogout } = useAuth();
    const navigate = useNavigate();

    const getHeaderInfo = () => {
        switch (activeTab) {
            case 'home': return { title: `Welcome, Dr. ${user.name}!`, subtitle: 'Your practice dashboard' };
            case 'patients': return { title: 'My Patients', subtitle: 'Manage all your patients' };
            case 'add-slots': return { title: 'Add Time Slots', subtitle: 'Schedule your availability' };
            case 'slots': return { title: 'My Slots', subtitle: 'View all your slots' };
            default: return { title: 'Dentist Dashboard', subtitle: 'Manage your dental practice' };
        }
    };

    const headerInfo = getHeaderInfo();

    // Close dropdown on outside click
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
        <div className="bg-white border-b border-emerald-100 p-4 flex justify-between items-center">
            <div className='hidden lg:block'>
                <h2 className="text-[16px] lg:text-2xl font-bold text-emerald-900">{headerInfo.title}</h2>
                <p className="text-emerald-600 mt-1">{headerInfo.subtitle}</p>
            </div>

            <div className='flex lg:hidden gap-2 items-center'>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}>
                    <ShieldCheckIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: '#14532d' }}>
                        Dent<span style={{ color: '#22c55e' }}>AI</span>
                    </h1>
                    <p className="text-xs font-medium" style={{ color: '#16a34a' }}>Dentist Portal</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* <div className="relative hidden lg:flex">
                    <MagnifyingGlassIcon className="w-5 h-5 text-emerald-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search patients, appointments..."
                        className="pl-10 pr-4 py-2 w-64 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-900 placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                </div> */}

                {/* Account dropdown */}
                <div className="relative hidden lg:block" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-3 focus:outline-none"
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-400 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-right">
                            <p className="font-medium text-emerald-900">Dr. {user.name}</p>
                            <p className="text-sm text-emerald-600">Dentist</p>
                        </div>
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-44 bg-white border border-emerald-100 rounded-xl shadow-lg z-50 overflow-hidden">
                            <button
                                onClick={() => { setDropdownOpen(false); navigate('/dentist-dashboard/account'); }}
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

export default DentistHeader;