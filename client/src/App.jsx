// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import Layout from './Components/Layout/Layout';
import PatientLogin from './Pages/PatientLogin/PatientLogin';
import PatientDashboard from './Pages/PatientDashboard/PatientDashboard';
import PatientUploadXray from './Pages/PatientUploadXRay/PatientUploadXRay';
import PatientAllReports from './Pages/PatientAllReports/PatientAllReports';
import PatientBookConsultation from './Pages/PatientBookConsultation/PatientBookConsultation';
import PatientAllConsultations from './Pages/PatientAllConsultations/PatientAllConsultations';
import DentistDashboard from './Pages/DentistDashboard/DentistDashboard';
import DentistAllPatients from './Pages/DentistAllPatients/DentistAllPatients';
import AddSlots from './Pages/AddSlots/AddSlots';
import AdminDashboard from './Pages/AdminDashboard/AdminDashboard';
import AdminDentists from './Pages/AdminDentists/AdminDentists';
import AdminPatients from './Pages/AdminPatients/AdminPatients';
import AdminReports from './Pages/AdminReports/AdminReports';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/patient-login" element={<PatientLogin isLogin={true} />} />
        <Route path="/patient-signup" element={<PatientLogin isLogin={false} />} />
        <Route path="/dentist-login" element={<div>Dentist Login Page</div>} />
        <Route path="/admin-login" element={<div>Admin Login Page</div>} />

        {/* Protected Routes with Layout */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          {/* Patient Routes */}
          <Route
            path="/patient-dashboard/home"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient-dashboard/upload"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientUploadXray />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient-dashboard/reports"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientAllReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient-dashboard/book"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientBookConsultation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient-dashboard/consultations"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientAllConsultations />
              </ProtectedRoute>
            }
          />

          {/* Dentist Routes */}
          <Route
            path="/dentist-dashboard/home"
            element={
              <ProtectedRoute allowedRoles={['dentist']}>
                <DentistDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dentist-dashboard/patients"
            element={
              <ProtectedRoute allowedRoles={['dentist']}>
                <DentistAllPatients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dentist-dashboard/slots"
            element={
              <ProtectedRoute allowedRoles={['dentist']}>
                <AddSlots />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin-dashboard/home"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard/dentists"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDentists />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard/patients"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPatients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard/reports"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminReports />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/patient-login" replace />} />
        <Route path="*" element={<Navigate to="/patient-login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;