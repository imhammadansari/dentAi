import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PatientLayout from './Components/PatientLayout/PatientLayout';
import DentistLayout from './Components/DentistLayout/DentistLayout';
import AdminLayout from './Components/AdminLayout/AdminLayout';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import PatientUploadXray from './pages/PatientUploadXRay/PatientUploadXRay';
import PatientBookConsultation from './pages/PatientBookConsultation/PatientBookConsultation';
import PatientAllConsultations from "./pages/PatientAllConsultations/PatientAllConsultations";
import PatientDashboard from "./pages/PatientDashboard/PatientDashboard";
import PatientAllReports from "./pages/PatientAllReports/PatientAllReports";
import DentistDashboard from './pages/DentistDashboard/DentistDashboard';
import DentistAllPatients from './pages/DentistAllPatients/DentistAllPatients';
import AddSlots from './pages/AddSlots/AddSlots';
import DentistLogin from './pages/DentistLogin/DentistLogin';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import AdminDentist from './pages/AdminDentist/AdminDentist';
import AdminAllReports from './pages/AdminAllReports/AdminAllReports';

import AdminPatient from './pages/AdminDentist/AdminDentist';
import AdminLogin from './pages/AdminLogin/AdminLogin';
import AdminRequests from './pages/AdminDentistRequests/AdminDentistRequests';
import Analyze from './pages/Analyze/Analyze';
import toast, { Toaster } from 'react-hot-toast';
import PatientLogin from './pages/PatientLogin/PatientLogin';
import AdminAllPatients from './pages/AdminAllPatients/AdminAllPatients';
import LandingPage from './pages/LandingPage/LandingPage';
import DentistAllSlots from './pages/DentistAllSlots/DentistAllSlots';
import BookSlot from './pages/PatientBookSlot/PatientBookSlot';
import PatientDetailPage from './pages/PatientDetailPage/PatientDetailPage';
import DentistAllAppointments from './pages/DentistAllAppointments/DentistAllAppointments';
import PatientBookingsPage from './pages/PatientBookingPage/PatientBookingPage';


function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/patient-login" element={<PatientLogin isLogin={true} />} />
        <Route path="/analyze" element={<Analyze isLogin={false} />} />
        <Route path="/patient-signup" element={<PatientLogin isLogin={false} />} />
        <Route path="/dentist-login" element={<DentistLogin isLogin={true} />} />
        <Route path="/dentist-signup" element={<DentistLogin isLogin={false} />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<LandingPage />} />

        <Route path="/requests" element={<AdminRequests />} />

        <Route path="/patient-dashboard" element={
          <ProtectedRoute allowedRoles="patient">
            <PatientLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<PatientDashboard />} />
          <Route path="upload" element={<PatientUploadXray />} />
          <Route path="reports" element={<PatientAllReports />} />
          <Route path="book" element={<PatientBookConsultation />} />
          <Route path="consultations" element={<PatientAllConsultations />} />
          <Route path="book-slot/:dentistId" element={<BookSlot />} />
        </Route>

        <Route path="/dentist-dashboard" element={
          <ProtectedRoute allowedRoles="dentist">
            <DentistLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<DentistDashboard />} />
          <Route path="patients" element={<DentistAllPatients />} />
          <Route path="add-slots" element={<AddSlots />} />
          <Route path="slots" element={<DentistAllSlots />} />
          <Route path="patient/:id" element={<PatientBookingsPage />} />

          <Route
            path="booking/:id"
            element={<PatientDetailPage />}
          />
          <Route path="appointments" element={<DentistAllAppointments />} />
        </Route>

        <Route path="/admin-dashboard" element={
          <ProtectedRoute allowedRoles="admin">
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<AdminDashboard />} />
          <Route path="patients" element={<AdminAllPatients />} />
          <Route path="dentists" element={<AdminDentist />} />
          <Route path="requests" element={<AdminRequests />} />
          <Route path="reports" element={<AdminAllReports />} />
        </Route>

        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  );
}

export default App;