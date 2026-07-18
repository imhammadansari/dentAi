import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    HomeIcon,
    UsersIcon,
    CalendarIcon,
    ShieldCheckIcon,
    ClipboardDocumentListIcon,
    BellIcon,
    CameraIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { IoMenuSharp } from 'react-icons/io5';

const navItems = [
    { id: 'home', path: '/dentist-dashboard/home', icon: HomeIcon, label: 'Dashboard' },
    { id: 'patients', path: '/dentist-dashboard/patients', icon: UsersIcon, label: 'My Patients' },
    { id: 'upcoming', path: '/dentist-dashboard/upcoming', icon: ClipboardDocumentListIcon, label: 'Upcoming' },
    { id: 'upload-xray', path: '/dentist-dashboard/upload-xray', icon: CameraIcon, label: 'Upload X-Ray' },
    { id: 'add-slots', path: '/dentist-dashboard/add-slots', icon: CalendarIcon, label: 'Add Slots' },
    { id: 'slots', path: '/dentist-dashboard/slots', icon: CalendarIcon, label: 'Slots' },
];

const DentistSidebar = ({ userData, setMobileSidebar }) => {
    const { name, email } = userData || {};
    const { handleLogout } = useAuth();
    const location = useLocation();

    // Derive active tab directly from URL — no state lag, no flash
    const getActiveId = (pathname) => {
        if (pathname.includes('upload-xray')) return 'upload-xray';
        if (pathname.includes('patients') && !pathname.includes('patient/')) return 'patients';
        if (pathname.includes('upcoming')) return 'upcoming';
        if (pathname.includes('add-slots')) return 'add-slots';
        if (pathname.includes('slots')) return 'slots';
        if (pathname.includes('account')) return 'account';
        return 'home';
    };

    const activeId = getActiveId(location.pathname);

    return (
        <div className="w-64 h-screen bg-gradient-to-br from-white to-emerald-50 border-r border-emerald-100 flex flex-col">
            <div className="p-6">
                <div className="flex items-center justify-between lg:justify-normal lg:gap-3 mb-6">
                    <div className='flex gap-2 items-center'>
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
                    <IoMenuSharp
                        onClick={() => setMobileSidebar && setMobileSidebar(false)}
                        className='text-emerald-900 w-6 h-6 cursor-pointer lg:hidden'
                    />
                </div>

                <div className="p-3 rounded-2xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '1px solid #d1fae5' }}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}>
                            <UserCircleIcon className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold" style={{ color: '#14532d' }}>Dr. {name}</h3>
                            <p className="text-sm" style={{ color: '#4b5563' }}>Dentist</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <BellIcon className="w-4 h-4" style={{ color: '#6b7280' }} />
                            <span className="text-xs" style={{ color: '#6b7280' }}>{email}</span>
                        </div>
                        <div className="text-xs bg-white/50 p-2 rounded-lg" style={{ color: '#6b7280' }}>
                            Last login: Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeId === item.id;
                        return (
                            <NavLink
                                key={item.id}
                                to={item.path}
                                onClick={() => setMobileSidebar && setMobileSidebar(false)}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                                    isActive
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
                        className="w-full flex cursor-pointer items-center gap-3 p-3 text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all"
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