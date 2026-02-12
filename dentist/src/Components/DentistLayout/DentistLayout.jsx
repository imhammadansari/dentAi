import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DentistSidebar from '../DentistSidebar/DentistSidebar';
import DentistHeader from '../DentistHeader/DentistHeader';
import { useAuth } from '../../context/AuthContext';

const DentistLayout = () => {
    const [activeTab, setActiveTab] = useState('home');
    const location = useLocation();
    const { user } = useAuth();
    const [mobileSidebar, setMobileSidebar] = useState(false);

    const toggleSidebar = () => {
        setMobileSidebar(!mobileSidebar);
    }

    useEffect(() => {

        const path = location.pathname;
        if (path.includes('patients')) setActiveTab('patients');
        else if (path.includes('slots')) setActiveTab('slots');
        else setActiveTab('home');
    }, [location.pathname]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-50">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                    <p className="text-blue-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-white to-blue-50 overflow-hidden">
            <div className="hidden lg:flex h-screen">
                <DentistSidebar activeTab={activeTab} setActiveTab={setActiveTab} userData={user} />
            </div>

            <div className={`absolute z-10 top-0 left-0 lg:hidden transform transition-transform duration-300 
                ${mobileSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
                <DentistSidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    userData={user}
                    setMobileSidebar={setMobileSidebar}
                />

            </div>

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <DentistHeader activeTab={activeTab} userData={user} toggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet context={{ activeTab, user }} />
                </main>
            </div>
        </div>
    );
};

export default DentistLayout;