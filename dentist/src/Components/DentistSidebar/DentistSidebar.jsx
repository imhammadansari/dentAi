// Components/Sidebar/DentistSidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    HomeIcon,
    UsersIcon,
    CalendarIcon,
    ShieldCheckIcon,
    BellIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios';

const DentistSidebar = ({ activeTab, setActiveTab, userData }) => {
    const navigate = useNavigate();
    const { name, email } = userData || {};

    const navItems = [
        { id: 'home', path: '/dentist-dashboard/home', icon: HomeIcon, label: 'Dashboard' },
        { id: 'patients', path: '/dentist-dashboard/patients', icon: UsersIcon, label: 'My Patients' },
        { id: 'slots', path: '/dentist-dashboard/slots', icon: CalendarIcon, label: 'Add Slots' },
    ];

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8000/api/users/logout', {}, {
                withCredentials: true
            });

            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');

            navigate('/dentist-login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="w-64 h-screen bg-gradient-to-br from-white to-emerald-50 border-r border-emerald-100 flex flex-col">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-10">
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

                <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 p-4 rounded-2xl mb-6 border border-emerald-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-400 rounded-full flex items-center justify-center">
                            <UserCircleIcon className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-emerald-900">Dr. {name}</h3>
                            <p className="text-sm text-emerald-600">Dentist</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <NavLink
                                key={item.id}
                                to={item.path}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow-lg shadow-emerald-200'
                                    : 'text-emerald-700 hover:bg-emerald-50 hover:shadow-sm'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="mt-8">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-3 text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all"
                    >
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DentistSidebar;