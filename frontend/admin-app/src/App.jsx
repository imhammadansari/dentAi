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
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

const ProtectedAdminRoute = ({ children }) => {
    const { loading, isAuthenticated, hasRole } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-t-emerald-500 border-emerald-200 rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated() || !hasRole('admin')) {
        return <Navigate to="/admin-login" replace />;
    }

    return children;
};

const PublicAdminRoute = ({ children }) => {
    const { loading, isAuthenticated, hasRole } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-t-emerald-500 border-emerald-200 rounded-full animate-spin" />
            </div>
        );
    }

    if (isAuthenticated() && hasRole('admin')) {
        return <Navigate to="/admin-dashboard/home" replace />;
    }

    return children;
};

function App() {
    return (
        <>
            <Toaster />
            <ScrollToTop />
            <Routes>
                <Route path="/admin-login" element={<PublicAdminRoute><AdminLogin /></PublicAdminRoute>} />

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