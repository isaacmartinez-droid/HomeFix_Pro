import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
          <p className="mt-4 font-body-md text-body-md text-on-surface-variant">Cargando HomeFix Pro...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to their appropriate dashboard
    const dashboardPaths = {
      CLIENTE: '/dashboard/cliente',
      TECNICO: '/dashboard/tecnico',
      EMPRESA: '/dashboard/empresa',
      ADMIN: '/dashboard/admin',
    };
    return <Navigate to={dashboardPaths[user.role] || '/login'} replace />;
  }

  return children;
};

export default ProtectedRoute;
