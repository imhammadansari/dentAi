// Components/Sidebar/Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    HomeIcon,
    DocumentArrowUpIcon,
    DocumentTextIcon,
    CalendarDaysIcon,
    ClockIcon,
    UsersIcon,
    CalendarIcon,
    ChartBarIcon,
    ShieldCheckIcon,
    BellIcon,
    Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios';

const Sidebar = ({ activeTab, setActiveTab, userData }) => {
    const navigate = useNavigate();
    const { role, name, email } = userData;

    // Define navigation items based on role
    const getNavItems = () => {
        switch (role) {
            case 'patient':
                return [
                    { id: 'home', path: '/patient-dashboard/home', icon: HomeIcon, label: 'Dashboard' },
                    { id: 'upload', path: '/patient-dashboard/upload', icon: DocumentArrowUpIcon, label: 'Upload X-Ray' },
                    { id: 'reports', path: '/patient-dashboard/reports', icon: DocumentTextIcon, label: 'My Reports' },
                    { id: 'book', path: '/patient-dashboard/book', icon: CalendarDaysIcon, label: 'Book Consultation' },
                    { id: 'consultations', path: '/patient-dashboard/consultations', icon: ClockIcon, label: 'My Consultations' },
                ];
            case 'dentist':
                return [
                    { id: 'home', path: '/dentist-dashboard/home', icon: HomeIcon, label: 'Dashboard' },
                    { id: 'patients', path: '/dentist-dashboard/patients', icon: UsersIcon, label: 'My Patients' },
                    { id: 'slots', path: '/dentist-dashboard/slots', icon: CalendarIcon, label: 'Add Slots' },
                ];
            case 'admin':
                return [
                    { id: 'home', path: '/admin-dashboard/home', icon: HomeIcon, label: 'Dashboard' },
                    { id: 'dentists', path: '/admin-dashboard/dentists', icon: UsersIcon, label: 'Dentists' },
                    { id: 'patients', path: '/admin-dashboard/patients', icon: UsersIcon, label: 'Patients' },
                    { id: 'reports', path: '/admin-dashboard/reports', icon: DocumentTextIcon, label: 'All Reports' },
                    { id: 'analytics', path: '/admin-dashboard/analytics', icon: ChartBarIcon, label: 'Analytics' },
                    { id: 'settings', path: '/admin-dashboard/settings', icon: Cog6ToothIcon, label: 'Settings' },
                ];
            default:
                return [];
        }
    };

    const getRoleInfo = () => {
        switch (role) {
            case 'patient':
                return {
                    title: 'Patient Portal',
                    gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    bgColor: '#f0fdf4',
                    borderColor: '#d1fae5'
                };
            case 'dentist':
                return {
                    title: 'Dentist Portal',
                    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    bgColor: '#eff6ff',
                    borderColor: '#dbeafe'
                };
            case 'admin':
                return {
                    title: 'Admin Portal',
                    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    bgColor: '#faf5ff',
                    borderColor: '#f3e8ff'
                };
            default:
                return {
                    title: 'Portal',
                    gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    bgColor: '#f0fdf4',
                    borderColor: '#d1fae5'
                };
        }
    };

    const roleInfo = getRoleInfo();
    const navItems = getNavItems();

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8000/api/users/logout', {}, {
                withCredentials: true
            });
            
            // Clear localStorage
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            
            navigate('/patient-login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="w-64 h-screen flex flex-col" style={{ backgroundColor: roleInfo.bgColor, borderRight: `1px solid ${roleInfo.borderColor}` }}>
            {/* Fixed top section */}
            <div className="p-6">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: roleInfo.gradient }}>
                        <ShieldCheckIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: '#14532d' }}>
                            Dent<span style={{ color: '#22c55e' }}>AI</span>
                        </h1>
                        <p className="text-xs font-medium" style={{ color: '#16a34a' }}>{roleInfo.title}</p>
                    </div>
                </div>

                {/* User Profile */}
                <div className="p-4 rounded-2xl mb-6" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', border: `1px solid ${roleInfo.borderColor}` }}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: roleInfo.gradient }}>
                            <UserCircleIcon className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold" style={{ color: '#14532d' }}>{name}</h3>
                            <p className="text-sm" style={{ color: '#4b5563', textTransform: 'capitalize' }}>{role}</p>
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

            {/* Scrollable navigation section */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
                {/* Navigation */}
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
                                    ? 'text-white shadow-lg'
                                    : 'text-gray-700 hover:bg-white/50 hover:shadow-sm'
                                    }`}
                                style={isActive ? { background: roleInfo.gradient } : {}}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Stats Section */}
                <div className="mt-8 p-4 rounded-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', border: `1px solid ${roleInfo.borderColor}` }}>
                    <h4 className="font-medium mb-2" style={{ color: '#14532d' }}>Quick Stats</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm" style={{ color: '#6b7280' }}>Today</span>
                            <span className="text-sm font-medium" style={{ color: '#14532d' }}>
                                {role === 'patient' ? '2 Appointments' : role === 'dentist' ? '8 Patients' : '142 Users'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm" style={{ color: '#6b7280' }}>This Week</span>
                            <span className="text-sm font-medium" style={{ color: '#14532d' }}>
                                {role === 'patient' ? '5 Activities' : role === 'dentist' ? '42 Appointments' : '99.9% Uptime'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Logout Button */}
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

export default Sidebar;