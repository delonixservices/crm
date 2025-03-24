import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, customerOnly = false }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route is customer-only and user is not a customer
  if (customerOnly && user.role !== 'customer') {
    return <Navigate to="/employee-dashboard" replace />;
  }

  // If route requires employee access and user is a customer
  if (!customerOnly && user.role === 'customer') {
    return <Navigate to="/lead-form" replace />;
  }

  return children;
};

export default PrivateRoute;