import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../AdminSidebar/AdminSidebar';
import AdminHeader from '../AdminHeader/AdminHeader';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
    const { user } = useAuth();
    const [mobileSidebar, setMobileSidebar] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);

    const toggleSidebar = () => setMobileSidebar(prev => !prev);

    return (
        <div className="flex h-screen bg-gradient-to-br from-white to-emerald-50 overflow-hidden">

            <div className="hidden lg:flex h-screen">
                <AdminSidebar userData={user || {}} />
            </div>

            <div className={`absolute z-20 top-0 left-0 lg:hidden transform transition-transform duration-300
                ${mobileSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
                <AdminSidebar userData={user || {}} setMobileSidebar={setMobileSidebar} />
            </div>

            {mobileSidebar && (
                <div
                    className="absolute inset-0 z-10 bg-black/30 lg:hidden"
                    onClick={() => setMobileSidebar(false)}
                />
            )}

            <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
                <AdminHeader userData={user} toggleSidebar={toggleSidebar} />

                <main id="main-scroll" className="flex-1 overflow-y-auto p-4 lg:p-6 relative">
                    {pageLoading && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                            <div className="text-center">
                                <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin mx-auto mb-3" />
                                <p className="text-emerald-600 text-sm font-medium">Loading Data...</p>
                            </div>
                        </div>
                    )}
                    <Outlet context={{ user, setPageLoading }} />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;