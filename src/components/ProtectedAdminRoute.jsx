import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protected route for admin users
const ProtectedAdminRoute = () => {
  const { user, loading } = useAuth();
  
  // If still loading authentication state, we can show a loading indicator
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  // If user is not authenticated or not an admin, redirect to login
  if (!user || user.role !== 'Admin') {
    return <Navigate to="/login" replace />;
  }
  
  // If user is authenticated and is an admin, render the child routes
  return <Outlet />;
};

export default ProtectedAdminRoute;
