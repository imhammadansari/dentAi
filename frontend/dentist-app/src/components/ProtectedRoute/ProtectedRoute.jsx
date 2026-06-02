import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading, isAuthenticated } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f0f9f0 0%, #e6f7e6 100%)' }}>
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 border-4 border-t-transparent border-green-500 rounded-full animate-spin"></div>
                    <p className="text-green-600">Checking authentication...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated()) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role.toLowerCase())) {
        switch (user?.role.toLowerCase()) {
            case 'patient':
                return <Navigate to="/patient-dashboard/home" replace />;
            case 'dentist':
                return <Navigate to="/dentist-dashboard/home" replace />;
            case 'admin':
                return <Navigate to="/admin-dashboard/home" replace />;
            default:
                return <Navigate to="/patient-login" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;