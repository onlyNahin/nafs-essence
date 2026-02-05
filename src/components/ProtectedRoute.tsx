import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../App';

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { auth, settings } = useApp();
  const location = useLocation();

  // If we don't know the auth state yet, show a clean loading screen
  // instead of accidentally redirecting the user to login.
  if (auth.isAuthenticated === null) {
    return (
      <div className="h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
        <div className="size-12 border-4 border-t-transparent animate-spin rounded-full" 
             style={{ borderColor: `${settings.primaryColor} transparent transparent transparent` }}>
        </div>
        <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">Verifying Credentials...</p>
      </div>
    );
  }

  // If not logged in, send them to login but remember where they were trying to go
  if (!auth.isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;