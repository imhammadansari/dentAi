import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DentistLayout from './components/DentistLayout/DentistLayout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import PublicRoute from './components/PublicRoute/PublicRoute';
import DentistDashboard from './pages/DentistDashboard/DentistDashboard';
import DentistAllPatients from './pages/DentistAllPatients/DentistAllPatients';
import AddSlots from './pages/AddSlots/AddSlots';
import DentistLogin from './pages/DentistLogin/DentistLogin';
import DentistAllSlots from './pages/DentistAllSlots/DentistAllSlots';
import PatientBookingsPage from './pages/PatientBookingPage/PatientBookingPage';
import PatientDetailPage from './pages/PatientDetailPage/PatientDetailPage';
import DentistAllAppointments from './pages/DentistAllAppointments/DentistAllAppointments';
import DentistAccount from './pages/DentistAccount/DentistAccount';
import Chat from './pages/Chat/Chat';
import { Toaster } from 'react-hot-toast';
import UpcomingConsultations from './pages/UpcomingConsultaions/UpcomingConsultations';
import DentistUploadXRay from './pages/DentistUploadXRay/DentistUploadXRay';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

function App() {
    return (
        <>
            <Toaster />
            <ScrollToTop />
            <Routes>
                <Route path="/dentist-login" element={<PublicRoute><DentistLogin isLogin={true} /></PublicRoute>} />
                <Route path="/dentist-signup" element={<PublicRoute><DentistLogin isLogin={false} /></PublicRoute>} />

                <Route path="/dentist-dashboard" element={
                    <ProtectedRoute allowedRoles={['dentist']}>
                        <DentistLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<Navigate to="home" replace />} />
                    <Route path="home" element={<DentistDashboard />} />
                    <Route path="patients" element={<DentistAllPatients />} />
                    <Route path="upload-xray" element={<DentistUploadXRay />} />
                    <Route path="add-slots" element={<AddSlots />} />
                    <Route path="slots" element={<DentistAllSlots />} />
                    <Route path="upcoming" element={<UpcomingConsultations />} />
                    <Route path="patient/:id" element={<PatientBookingsPage />} />
                    <Route path="booking/:id" element={<PatientDetailPage />} />
                    <Route path="appointments" element={<DentistAllAppointments />} />
                    <Route path="account" element={<DentistAccount />} />
                    <Route path="chat/:bookingId" element={<Chat />} />
                </Route>

                <Route path="/" element={<Navigate to="/dentist-login" replace />} />
                <Route path="*" element={<Navigate to="/dentist-login" replace />} />
            </Routes>
        </>
    );
}

export default App;