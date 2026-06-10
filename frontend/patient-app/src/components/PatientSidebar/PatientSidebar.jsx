import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    HomeIcon,
    DocumentArrowUpIcon,
    DocumentTextIcon,
    CalendarDaysIcon,
    ClockIcon,
    ShieldCheckIcon,
    BellIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { IoMenuSharp } from 'react-icons/io5';

const navItems = [
    { id: 'home', path: '/patient-dashboard/home', icon: HomeIcon, label: 'Dashboard' },
    { id: 'upload', path: '/patient-dashboard/upload', icon: DocumentArrowUpIcon, label: 'Upload X-Ray' },
    { id: 'reports', path: '/patient-dashboard/reports', icon: DocumentTextIcon, label: 'My Reports' },
    { id: 'book', path: '/patient-dashboard/book', icon: CalendarDaysIcon, label: 'Book Consultation' },
    { id: 'consultations', path: '/patient-dashboard/consultations', icon: ClockIcon, label: 'My Consultations' },
];

const PatientSidebar = ({ userData, setMobileSidebar }) => {
    const { name, email } = userData || {};
    const { handleLogout } = useAuth();
    const location = useLocation();

    // Derive active tab directly from URL — no state lag, no flash
    const getActiveId = (pathname) => {
        if (pathname.includes('upload')) return 'upload';
        if (pathname.includes('reports')) return 'reports';
        if (pathname.includes('book-slot') || pathname.includes('/book')) return 'book';
        if (pathname.includes('consultations') || pathname.includes('consultation/')) return 'consultations';
        if (pathname.includes('account')) return 'account';
        return 'home';
    };

    const activeId = getActiveId(location.pathname);

    return (
        <div className="w-64 h-screen flex flex-col" style={{ backgroundColor: '#f0fdf4', borderRight: '1px solid #d1fae5' }}>
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
                            <p className="text-xs font-medium" style={{ color: '#16a34a' }}>Patient Portal</p>
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
                            <h3 className="font-semibold" style={{ color: '#14532d' }}>{name}</h3>
                            <p className="text-sm" style={{ color: '#4b5563' }}>Patient</p>
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

                <div className="mt-8 p-4 rounded-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '1px solid #d1fae5' }}>
                    <h4 className="font-medium mb-2" style={{ color: '#14532d' }}>Quick Stats</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm" style={{ color: '#6b7280' }}>Today</span>
                            <span className="text-sm font-medium" style={{ color: '#14532d' }}>2 Appointments</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm" style={{ color: '#6b7280' }}>This Week</span>
                            <span className="text-sm font-medium" style={{ color: '#14532d' }}>5 Activities</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/50"
                        style={{ color: '#6b7280' }}
                    >
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PatientSidebar;