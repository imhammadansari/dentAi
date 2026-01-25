import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PatientSidebar from '../PatientSidebar/PatientSidebar';
import PatientHeader from '../PatientHeader/PatientHeader';
import { useAuth } from '../../context/AuthContext';

const PatientLayout = () => {
    const [activeTab, setActiveTab] = useState('home');
    const location = useLocation();
    const { user } = useAuth();

    useEffect(() => {
        const path = location.pathname;
        if (path.includes('upload')) setActiveTab('upload');
        else if (path.includes('reports')) setActiveTab('reports');
        else if (path.includes('book')) setActiveTab('book');
        else if (path.includes('consultations')) setActiveTab('consultations');
        else setActiveTab('home');

    }, [location.pathname]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f0f9f0 0%, #e6f7e6 100%)' }}>
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 border-4 border-t-transparent border-green-500 rounded-full animate-spin"></div>
                    <p style={{ color: '#16a34a' }}>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-white to-green-50 overflow-hidden">
            <div className="h-screen">
                <PatientSidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    userData={user}
                />
            </div>

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <PatientHeader activeTab={activeTab} userData={user} />

                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet context={{ activeTab, user }} />
                </main>
            </div>
        </div>
    );
};

export default PatientLayout;