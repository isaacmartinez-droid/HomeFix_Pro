import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));

// Client Pages
const ClientDashboard = lazy(() => import('./pages/client/ClientDashboard'));
const CreateRequestPage = lazy(() => import('./pages/client/CreateRequestPage'));
const MyRequestsPage = lazy(() => import('./pages/client/MyRequestsPage'));
const SearchProvidersPage = lazy(() => import('./pages/client/SearchProvidersPage'));

// Technician Pages
const TechDashboard = lazy(() => import('./pages/technician/TechDashboard'));
const AvailableJobsPage = lazy(() => import('./pages/technician/AvailableJobsPage'));
const MyAssignedJobsPage = lazy(() => import('./pages/technician/MyAssignedJobsPage'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <span className="material-symbols-outlined text-5xl text-primary" style={{ animation: 'spin 1s linear infinite' }}>
        progress_activity
      </span>
      <p className="mt-4 font-body-md text-body-md text-on-surface-variant">Cargando...</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Client Routes */}
            <Route path="/dashboard/cliente" element={
              <ProtectedRoute allowedRoles={['CLIENTE']}>
                <ClientDashboard />
              </ProtectedRoute>
            } />
            <Route path="/cliente/solicitar" element={
              <ProtectedRoute allowedRoles={['CLIENTE']}>
                <CreateRequestPage />
              </ProtectedRoute>
            } />
            <Route path="/cliente/solicitudes" element={
              <ProtectedRoute allowedRoles={['CLIENTE']}>
                <MyRequestsPage />
              </ProtectedRoute>
            } />
            <Route path="/cliente/tecnicos" element={
              <ProtectedRoute allowedRoles={['CLIENTE']}>
                <SearchProvidersPage />
              </ProtectedRoute>
            } />

            {/* Technician Routes */}
            <Route path="/dashboard/tecnico" element={
              <ProtectedRoute allowedRoles={['TECNICO']}>
                <TechDashboard />
              </ProtectedRoute>
            } />
            <Route path="/tecnico/trabajos-disponibles" element={
              <ProtectedRoute allowedRoles={['TECNICO']}>
                <AvailableJobsPage />
              </ProtectedRoute>
            } />
            <Route path="/tecnico/mis-trabajos" element={
              <ProtectedRoute allowedRoles={['TECNICO']}>
                <MyAssignedJobsPage />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/dashboard/admin" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
