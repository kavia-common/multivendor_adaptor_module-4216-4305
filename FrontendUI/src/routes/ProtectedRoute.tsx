import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type Props = {
  onNotify?: (type: 'success'|'error'|'info', message: string) => void;
};

// PUBLIC_INTERFACE
export default function ProtectedRoute({ onNotify }: Props) {
  /** Protect routes, redirect unauthenticated users to /login */
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated && onNotify) {
      onNotify('info', 'Please login to continue.');
    }
  }, [isAuthenticated, onNotify]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}
