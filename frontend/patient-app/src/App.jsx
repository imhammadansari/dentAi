import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PatientLayout from './components/PatientLayout/PatientLayout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import PublicRoute from './components/PublicRoute/PublicRoute';
import LandingPage from './pages/LandingPage/LandingPage';
import PatientLogin from './pages/PatientLogin/PatientLogin';
import PatientDashboard from './pages/PatientDashboard/PatientDashboard';
import PatientAllConsultations from './pages/PatientAllConsultations/PatientAllConsultations';
import PatientConsultationDetail from './pages/PatientConsultationDetail/PatientConsultationDetail';
import PatientAllReports from './pages/PatientAllReports/PatientAllReports';
import PatientUploadXRay from './pages/PatientUploadXRay/PatientUploadXRay';
import PatientBookConsultation from './pages/PatientBookConsultation/PatientBookConsultation';
import PatientBookSlot from './pages/PatientBookSlot/PatientBookSlot';
import PatientAccount from './pages/PatientAccount/PatientAccount';
import Analyze from './pages/Analyze/Analyze';
import Chat from './pages/Chat/Chat';
import { Toaster } from 'react-hot-toast';
import PatientUploadXray from './pages/PatientUploadXRay/PatientUploadXRay';
import BookSlot from './pages/PatientBookSlot/PatientBookSlot';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

function App() {
    return (
        <>
            <Toaster />
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/patient-login" element={<PublicRoute><PatientLogin isLogin={true} /></PublicRoute>} />
                <Route path="/patient-signup" element={<PublicRoute><PatientLogin isLogin={false} /></PublicRoute>} />

                <Route path="/patient-dashboard" element={
                    <ProtectedRoute allowedRoles={['patient']}>
                        <PatientLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<Navigate to="home" replace />} />
                    <Route path="home" element={<PatientDashboard />} />
                    <Route path="upload" element={<PatientUploadXray />} />
                    <Route path="reports" element={<PatientAllReports />} />
                    <Route path="book" element={<PatientBookConsultation />} />
                    <Route path="consultations" element={<PatientAllConsultations />} />
                    <Route path="consultation/:id" element={<PatientConsultationDetail />} />
                    <Route path="book-slot/:dentistId" element={<BookSlot />} />
                    <Route path="account" element={<PatientAccount />} />
                    <Route path="chat/:bookingId" element={<Chat />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
}

export default App;