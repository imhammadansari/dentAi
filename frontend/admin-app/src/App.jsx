import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout/AdminLayout';
import AdminLogin from './pages/AdminLogin/AdminLogin';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import AdminDentist from './pages/AdminDentist/AdminDentist';
import AdminAllPatients from './pages/AdminAllPatients/AdminAllPatients';
import AdminAllReports from './pages/AdminAllReports/AdminAllReports';
import AdminDentistRequests from './pages/AdminDentistRequests/AdminDentistRequests';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';

const ProtectedAdminRoute = ({ children }) => {
    const { loading, isAuthenticated } = useAuth();

    // While verifyUser is running, check localStorage directly to avoid flash redirect
    const storedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
    const storedToken = localStorage.getItem("accessToken");

    if (loading) {
        // Show spinner only if there is no stored session at all
        if (!storedUser || !storedToken) {
            return <Navigate to="/admin-login" replace />;
        }
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-t-emerald-500 border-emerald-200 rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated() || storedUser?.role?.toLowerCase() !== 'admin') {
        return <Navigate to="/admin-login" replace />;
    }

    return children;
};

function App() {
    return (
        <>
            <Toaster />
            <Routes>
                <Route path="/admin-login" element={<AdminLogin />} />

                <Route path="/admin-dashboard" element={
                    <ProtectedAdminRoute>
                        <AdminLayout />
                    </ProtectedAdminRoute>
                }>
                    <Route index element={<Navigate to="home" replace />} />
                    <Route path="home" element={<AdminDashboard />} />
                    <Route path="dentists" element={<AdminDentist />} />
                    <Route path="patients" element={<AdminAllPatients />} />
                    <Route path="reports" element={<AdminAllReports />} />
                    <Route path="requests" element={<AdminDentistRequests />} />
                </Route>

                <Route path="/" element={<Navigate to="/admin-login" replace />} />
                <Route path="*" element={<Navigate to="/admin-login" replace />} />
            </Routes>
        </>
    );
}

export default App;