//** Protects routes by checking if a user is authenticated, otherwise redirects to login **//

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PrivateRoute component
 * Wrap around components that require user authentication.
 * If the user is not authenticated, redirects to "/login".
 */
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  //** If user is authenticated, render children; otherwise, redirect to login page **//
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
