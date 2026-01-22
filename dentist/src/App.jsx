import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PatientLayout from './Components/PatientLayout/PatientLayout';
import DentistLayout from './Components/DentistLayout/DentistLayout';
import AdminLayout from './Components/AdminLayout/AdminLayout';
import PatientLogin from './Pages/PatientLogin/PatientLogin';
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

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/patient-login" element={<PatientLogin isLogin={true} />} />
      <Route path="/analyze" element={<Analyze isLogin={false} />} />
      <Route path="/patient-signup" element={<PatientLogin isLogin={false} />} />
      <Route path="/dentist-login" element={<DentistLogin isLogin={true} />} />
      <Route path="/dentist-signup" element={<DentistLogin isLogin={false} />} />
      <Route path="/admin-login" element={<AdminLogin />} />

      <Route path="/requests" element={<AdminRequests />} />

      {/* Patient Routes */}
      <Route path="/patient-dashboard" element={
        <ProtectedRoute allowedRole="patient">
          <PatientLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<PatientDashboard />} />
        <Route path="upload" element={<PatientUploadXray />} />
        <Route path="reports" element={<PatientAllReports />} />
        <Route path="book" element={<PatientBookConsultation />} />
        <Route path="consultations" element={<PatientAllConsultations />} />
      </Route>

      {/* Dentist Routes */}
      <Route path="/dentist-dashboard" element={
        <ProtectedRoute allowedRole="dentist">
          <DentistLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<DentistDashboard />} />
        <Route path="patients" element={<DentistAllPatients />} />
        <Route path="slots" element={<AddSlots />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin-dashboard" element={
        <ProtectedRoute allowedRole="admin">
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<AdminDashboard />} />
        <Route path="patients" element={<AdminPatient />} />
        <Route path="dentists" element={<AdminDentist />} />
        <Route path="requests" element={<AdminRequests />} />
        <Route path="reports" element={<AdminAllReports />} />
      </Route>

      {/* Default redirects */}
      <Route path="/" element={<Navigate to="/patient-login" replace />} />
      <Route path="*" element={<Navigate to="/patient-login" replace />} />
    </Routes>
  );
}

export default App;