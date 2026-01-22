// Components/Layout/Layout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';

const Layout = () => {
    const [activeTab, setActiveTab] = useState('home');
    const location = useLocation();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Get user data from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUserData(JSON.parse(storedUser));
        }
        
        // Set active tab based on route
        const path = location.pathname;
        if (path.includes('patient-dashboard')) {
            if (path.includes('upload')) setActiveTab('upload');
            else if (path.includes('reports')) setActiveTab('reports');
            else if (path.includes('book')) setActiveTab('book');
            else if (path.includes('consultations')) setActiveTab('consultations');
            else setActiveTab('home');
        } else if (path.includes('dentist-dashboard')) {
            if (path.includes('patients')) setActiveTab('patients');
            else if (path.includes('slots')) setActiveTab('slots');
            else setActiveTab('home');
        } else if (path.includes('admin-dashboard')) {
            if (path.includes('dentists')) setActiveTab('dentists');
            else if (path.includes('patients')) setActiveTab('patients');
            else if (path.includes('reports')) setActiveTab('reports');
            else setActiveTab('home');
        }
    }, [location.pathname]);

    if (!userData) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f0f9f0 0%, #e6f7e6 100%)' }}>
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 border-4 border-t-transparent border-green-500 rounded-full animate-spin"></div>
                    <p style={{ color: '#16a34a' }}>Loading user data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-white to-green-50 overflow-hidden">
            {/* Sidebar */}
            <div className="h-screen">
                <Sidebar 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                    userData={userData} 
                />
            </div>

            {/* Main content area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <Header activeTab={activeTab} userData={userData} />

                {/* Main content - Scrollable area */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet context={{ activeTab, userData }} />
                </main>
            </div>
        </div>
    );
};

export default Layout;