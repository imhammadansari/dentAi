import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    HomeIcon,
    UsersIcon,
    DocumentTextIcon,
    ShieldCheckIcon,
    BellIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { IoMenuSharp } from 'react-icons/io5';

const AdminSidebar = ({ activeTab, setActiveTab, userData, setMobileSidebar }) => {
    const { name, email } = userData;
    const { handleLogout } = useAuth();

    const navItems = [
        { id: 'home', path: '/admin-dashboard/home', icon: HomeIcon, label: 'Dashboard' },
        { id: 'patients', path: '/admin-dashboard/patients', icon: UsersIcon, label: 'All Patients' },
        { id: 'dentists', path: '/admin-dashboard/dentists', icon: UsersIcon, label: 'All Dentists' },
        { id: 'requests', path: '/admin-dashboard/requests', icon: CheckCircleIcon, label: 'Dentist Requests' },
        { id: 'reports', path: '/admin-dashboard/reports', icon: DocumentTextIcon, label: 'All Reports' },
    ];


    return (
        <div className="w-64 h-screen flex flex-col" style={{ backgroundColor: '#f0fdf4', borderRight: '1px solid #d1fae5' }}>
            <div className="p-6">
                <div className="flex items-center justify-between lg:justify-normal lg:gap-3 mb-6">
                    <div className='flex gap-2 items-center'>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}>
                            <ShieldCheckIcon className="w-6 h-6 text-white cusror-pointer" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold" style={{ color: '#14532d' }}>
                                Dent<span style={{ color: '#22c55e' }}>AI</span>
                            </h1>
                            <p className="text-xs font-medium" style={{ color: '#16a34a' }}>Admin Portal</p>
                        </div>

                    </div>

                    <IoMenuSharp onClick={() => setMobileSidebar(false)} className='text-emerald-900 w-6 h-6 cusror-pointer lg:hidden' />
                </div>

                <div className="p-4 rounded-2xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '1px solid #f3e8ff' }}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}>
                            <UserCircleIcon className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">{name}</h3>
                            <p className="text-sm text-gray-600">System Admin</p>
                        </div>
                    </div>
                    <div className="">
                        <div className="flex items-center gap-2">
                            <BellIcon className="w-4 h-4 text-gray-500" />
                            <span className="text-xs text-gray-600">{email}</span>
                        </div>
                        <div className="text-xs bg-white/50 p-2 rounded-lg text-gray-600">
                            Last login: Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setMobileSidebar(false)

                                }}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${isActive
                                    ? 'text-white shadow-lg'
                                    : 'text-gray-700 hover:bg-white/50 hover:shadow-sm'
                                    }`}
                                style={isActive ? { background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' } : {}}
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
                        className="w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/50 text-gray-700"
                    >
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;