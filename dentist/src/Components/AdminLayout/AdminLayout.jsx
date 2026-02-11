import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../AdminSidebar/AdminSidebar';
import AdminHeader from '../AdminHeader/AdminHeader';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
    const [activeTab, setActiveTab] = useState('home');
    const location = useLocation();
    const { user } = useAuth();

    useEffect(() => {

        const path = location.pathname;
        if (path.includes('dentists')) setActiveTab('dentists');
        else if (path.includes('patients')) setActiveTab('patients');
        else if (path.includes('reports')) setActiveTab('reports');
        else setActiveTab('home');
    }, [location.pathname]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-purple-50">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 border-4 border-t-transparent border-purple-500 rounded-full animate-spin"></div>
                    <p className="text-purple-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-white to-emerald-50 overflow-hidden">
            <div className="hidden lg:flex h-screen">
                <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} userData={user} />
            </div>
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <AdminHeader activeTab={activeTab} userData={user} />
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet context={{ activeTab, user }} />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;