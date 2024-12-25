//** Context for managing user authentication state throughout the application **//

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

//** Hook for consuming AuthContext data **//
export const useAuth = () => useContext(AuthContext);

//** AuthProvider component that wraps parts of the app needing authentication **//
export const AuthProvider = ({ children }) => {
  //** Local state for storing user data and loading status **//
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //** Fetch current user session on component mount **//
  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get('/api/auth/session', { withCredentials: true });
      setUser(response.data.user);
    } catch (error) {
      console.error('[ERROR] Failed to fetch user session:', error.response?.data || error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  //** Attempt to log in with provided credentials **//
  const login = async (username, password, rememberMe) => {
    try {
      const response = await axios.post(
        '/api/auth/login',
        { username, password, rememberMe },
        { withCredentials: true }
      );
      setUser(response.data.user);
    } catch (error) {
      console.error('[ERROR] Login failed:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  //** Log out the current user and clear session **//
  const logout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error('[ERROR] Logout failed:', error.message);
    }
  };

  //** Register a new user with specified credentials **//
  const register = async (username, password) => {
    try {
      const response = await axios.post(
        '/api/auth/register',
        { username, password },
        { withCredentials: true }
      );
      return response.data.message; //** Return success message to the calling component **//
    } catch (error) {
      console.error('[ERROR] Registration failed:', error.response?.data || error.message);
      throw error;
    }
  };

  //** Load the current user session once when component mounts **//
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  //** Provide user-related data and methods to child components **//
  return (
    <AuthContext.Provider value={{ user, register, login, logout, isAdmin: user?.isAdmin }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
