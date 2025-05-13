// components/admin/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store.ts';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useSelector((state: RootState) => state.adminAuth);

  if (!isAuthenticated) {
    // Redirect to admin login if not authenticated
    return <Navigate to="/management-console-login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;