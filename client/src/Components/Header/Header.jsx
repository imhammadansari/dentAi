// Components/Header/Header.jsx
import React from 'react';
import { BellIcon, MagnifyingGlassIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

const Header = ({ activeTab, userData }) => {
    const { role, name } = userData;

    const getHeaderInfo = () => {
        const commonTitles = {
            home: 'Dashboard',
            upload: 'Upload X-Ray',
            reports: 'Reports',
            book: 'Book Consultation',
            consultations: 'My Consultations',
            patients: 'Patients',
            slots: 'Add Slots',
            dentists: 'Dentist Management',
            analytics: 'Analytics',
            settings: 'Settings'
        };

        const title = commonTitles[activeTab] || 'Dashboard';
        
        switch (role) {
            case 'patient':
                return {
                    title: `Patient ${title}`,
                    subtitle: 'Manage your dental health journey'
                };
            case 'dentist':
                return {
                    title: `Dentist ${title}`,
                    subtitle: 'Manage your dental practice efficiently'
                };
            case 'admin':
                return {
                    title: `Admin ${title}`,
                    subtitle: 'System administration and monitoring'
                };
            default:
                return {
                    title: title,
                    subtitle: 'Welcome to DentAI'
                };
        }
    };

    const getRoleColor = () => {
        switch (role) {
            case 'patient': return { primary: '#16a34a', light: '#dcfce7' };
            case 'dentist': return { primary: '#3b82f6', light: '#dbeafe' };
            case 'admin': return { primary: '#8b5cf6', light: '#f3e8ff' };
            default: return { primary: '#16a34a', light: '#dcfce7' };
        }
    };

    const roleColor = getRoleColor();
    const headerInfo = getHeaderInfo();

    return (
        <div className="bg-white border-b p-6 flex justify-between items-center" style={{ borderColor: roleColor.light }}>
            <div className="flex-1">
                <h2 className="text-2xl font-bold" style={{ color: '#14532d' }}>{headerInfo.title}</h2>
                <p className="mt-1" style={{ color: '#6b7280' }}>{headerInfo.subtitle}</p>
            </div>

            <div className="flex items-center gap-4">
                {/* Search Bar */}
                <div className="relative">
                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#9ca3af' }} />
                    <input
                        type="text"
                        placeholder={`Search ${role === 'patient' ? 'reports' : role === 'dentist' ? 'patients' : 'users'}...`}
                        className="pl-10 pr-4 py-2 w-64 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-1"
                        style={{
                            backgroundColor: '#f9fafb',
                            border: '1px solid #d1fae5',
                            color: '#1f2937'
                        }}
                    />
                </div>

                {/* Help Button */}
                <button className="p-2 rounded-xl hover:bg-gray-50" style={{ color: '#6b7280' }}>
                    <QuestionMarkCircleIcon className="w-6 h-6" />
                </button>

                {/* Notifications */}
                <button className="relative p-2 rounded-xl hover:bg-gray-50" style={{ color: '#6b7280' }}>
                    <BellIcon className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        3
                    </span>
                </button>

                {/* Profile */}
                <div className="flex items-center gap-3">
                    <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                        style={{ background: roleColor.primary }}
                    >
                        {name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-right">
                        <p className="font-medium" style={{ color: '#14532d' }}>{name}</p>
                        <p className="text-sm capitalize" style={{ color: '#6b7280' }}>{role}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;