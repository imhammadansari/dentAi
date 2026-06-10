import React from 'react';
import { BellIcon, MagnifyingGlassIcon, QuestionMarkCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { IoMenuSharp } from 'react-icons/io5';

const AdminHeader = ({ activeTab, userData, toggleSidebar }) => {
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
        <div className="bg-white border-b border-emerald-100 p-4 flex justify-between items-center">
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
                    <p className="text-xs font-medium" style={{ color: '#16a34a' }}>Admin Portal</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* <div className="relative hidden lg:flex">
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search users, reports..."
                        className="pl-10 pr-4 py-2 w-64 bg-gray-50 border border-emerald-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                </div> */}

                {/* <button className="hidden lg:flex p-2 text-gray-500 hover:bg-gray-50 rounded-xl">
                    <QuestionMarkCircleIcon className="w-6 h-6" />
                </button> */}

                {/* <button className="hidden lg:flex relative p-2 text-gray-500 hover:bg-gray-50 rounded-xl">
                    <BellIcon className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        7
                    </span>
                </button> */}

                <div className="hidden lg:flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-400 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-right hidden lg:block">
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">System Admin</p>
                    </div>
                </div>

                <div className='lg:hidden'>
                    <IoMenuSharp onClick={toggleSidebar} className='w-8 h-8 text-emerald-900 cusror-pointer' />
                </div>
            </div>
        </div>
    );
};

export default AdminHeader;