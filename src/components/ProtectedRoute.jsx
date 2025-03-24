import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; // Optional loading state
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If requiredRoles is empty, it means any authenticated user can access
  if (requiredRoles.length > 0 && !requiredRoles.includes(user?.role)) {
    return <Navigate to="/" replace />; // Redirect to home or unauthorized page
  }

  return children;
};

export default ProtectedRoute;