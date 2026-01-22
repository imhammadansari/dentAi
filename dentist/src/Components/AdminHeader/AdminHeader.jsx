// Components/Header/AdminHeader.jsx
import React from 'react';
import { BellIcon, MagnifyingGlassIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

const AdminHeader = ({ activeTab, userData }) => {
    const user = userData || { name: 'Admin User' };

    const getHeaderInfo = () => {
        switch (activeTab) {
            case 'home': return { title: 'Admin Dashboard', subtitle: 'System overview and analytics' };
            case 'dentists': return { title: 'Dentist Management', subtitle: 'Manage all dental professionals' };
            case 'patients': return { title: 'Patient Management', subtitle: 'View and manage patient records' };
            case 'requests': return { title: 'Dentist Requests', subtitle: 'Approve dentist registrations' };
            case 'reports': return { title: 'All Reports', subtitle: 'View all generated reports' };
            case 'analytics': return { title: 'Analytics', subtitle: 'System performance and insights' };
            default: return { title: 'Admin Dashboard', subtitle: 'System administration' };
        }
    };

    const headerInfo = getHeaderInfo();

    return (
        <div className="bg-white border-b border-emerald-100 p-6 flex justify-between items-center">
            <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{headerInfo.title}</h2>
                <p className="text-emerald-600 mt-1">{headerInfo.subtitle}</p>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative">
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search users, reports..."
                        className="pl-10 pr-4 py-2 w-64 bg-gray-50 border border-emerald-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                </div>

                <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-xl">
                    <QuestionMarkCircleIcon className="w-6 h-6" />
                </button>

                <button className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-xl">
                    <BellIcon className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        7
                    </span>
                </button>

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-right">
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">System Admin</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHeader;