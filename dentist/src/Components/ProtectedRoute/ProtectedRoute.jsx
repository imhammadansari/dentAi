// Components/ProtectedRoute/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children, allowedRole }) => {
    const [auth, setAuth] = useState({ isAuthenticated: false, userRole: null });
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const user = JSON.parse(storedUser);
                    setAuth({
                        isAuthenticated: true,
                        userRole: user.role
                    });
                    setLoading(false);
                    return;
                }

                const response = await axios.get('http://localhost:8000/api/users/verify', {
                    withCredentials: true
                });

                if (response.data.success) {
                    const userData = response.data.user;
                    localStorage.setItem('user', JSON.stringify(userData));
                    
                    setAuth({
                        isAuthenticated: true,
                        userRole: userData.role
                    });
                }
            } catch (error) {
                console.error('Auth verification failed:', error);
                setAuth({ isAuthenticated: false, userRole: null });
                
                try {
                    await axios.post('http://localhost:8000/api/users/refresh-token', {}, {
                        withCredentials: true
                    });
                    const retryResponse = await axios.get('http://localhost:8000/api/users/verify', {
                        withCredentials: true
                    });
                    if (retryResponse.data.success) {
                        const userData = retryResponse.data.user;
                        localStorage.setItem('user', JSON.stringify(userData));
                        setAuth({
                            isAuthenticated: true,
                            userRole: userData.role
                        });
                    }
                } catch (refreshError) {
                    setAuth({ isAuthenticated: false, userRole: null });
                }
            } finally {
                setLoading(false);
            }
        };

        verifyAuth();
    }, [location.pathname]);

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

    if (!auth.isAuthenticated) {
        return <Navigate to="/patient-login" replace />;
    }

    // Check role-based access
    if (allowedRole && auth.userRole !== allowedRole) {
        // Redirect based on role
        switch (auth.userRole) {
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