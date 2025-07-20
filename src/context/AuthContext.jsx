import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { logoutFromSocial } from '../utils/authUtils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5003/api';

const AuthContext = createContext();

// Helper to set Auth token for subsequent requests
const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('Token set in Axios defaults');
  } else {
    delete axios.defaults.headers.common['Authorization'];
    console.log('Token removed from Axios defaults');
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('sproutSphereToken'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to get error message
  const getErrorMessage = useCallback((err) => {
    if (err.response?.data?.message) {
      return err.response.data.message;
    } else if (err.message) {
      return err.message;
    } else {
      return 'An error occurred';
    }
  }, []);

  // Helper function to fetch user data after login/register
  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem('sproutSphereToken');
      if (!token) {
        console.log('No token found, skipping user data fetch');
        return;
      }

      console.log(`Fetching user data from ${API_URL}/auth/user`);
      const res = await axios.get(`${API_URL}/auth/user`); // Token is already in defaults
      setUser(res.data);
      setIsAuthenticated(true);
      console.log('User data fetched successfully:', res.data);
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      console.error("Failed to fetch user data:", errorMsg, err.response?.data);
      
      // If token is invalid, clear it and log user out
      if (err.response?.status === 401) {
        console.log('Token invalid, clearing authentication');
        localStorage.removeItem('sproutSphereToken');
        setAuthToken(null);
        setToken(null);
        setIsAuthenticated(false);
        setUser(null);
      } else {
        toast.warn(`Could not refresh user data: ${errorMsg}`);
      }
    }
  }, [getErrorMessage]);

  // Load user on app start if token exists
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('sproutSphereToken');
      if (storedToken) {
        setAuthToken(storedToken); // Set token in axios defaults
        setToken(storedToken);
        setIsAuthenticated(true);
        try {
          await fetchUserData();
        } catch (error) {
          console.error('Failed to load user data:', error);
          // Don't clear token on network errors, only on auth errors
          if (error.response?.status === 401) {
            localStorage.removeItem('sproutSphereToken');
            setAuthToken(null);
            setToken(null);
            setIsAuthenticated(false);
            setUser(null);
          }
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [fetchUserData]); // Only run when fetchUserData changes

  // Register User
  const register = useCallback(async (name, email, password) => {
    const config = { headers: { 'Content-Type': 'application/json' } };
    const body = JSON.stringify({ name, email, password });
    try {
      const res = await axios.post(`${API_URL}/auth/register`, body, config);
      localStorage.setItem('sproutSphereToken', res.data.token);
      setAuthToken(res.data.token); // Set token in axios defaults
      setToken(res.data.token);
      setIsAuthenticated(true);
      await fetchUserData(); // Fetch full user data after registration
      console.log('Registration successful');
      toast.success('Registration successful! Welcome!');
      return true; // Indicate success
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      console.error("Registration error:", errorMsg, err.response?.data);
      toast.error(`Registration failed: ${errorMsg}`);
      return false; // Indicate failure
    }
  }, [fetchUserData, getErrorMessage]);

  // Login User
  const login = useCallback(async (email, password) => {
    const config = { headers: { 'Content-Type': 'application/json' } };
    const body = JSON.stringify({ email, password });
    try {
      const res = await axios.post(`${API_URL}/auth/login`, body, config);
      localStorage.setItem('sproutSphereToken', res.data.token);
      setAuthToken(res.data.token); // Set token in axios defaults
      setToken(res.data.token);
      setIsAuthenticated(true);
      await fetchUserData(); // Fetch full user data after login
      console.log('Login successful');
      toast.success('Login successful! Welcome back!');
      return true; // Indicate success
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      console.error("Login error:", errorMsg, err.response?.data);
      toast.error(`Login failed: ${errorMsg}`);
      return false; // Indicate failure
    }
  }, [fetchUserData, getErrorMessage]);

  // Social Authentication Methods
  const handleSocialAuth = useCallback(async (authData) => {
    try {
      if (authData.success && authData.token) {
        localStorage.setItem('sproutSphereToken', authData.token);
        setAuthToken(authData.token); // Set token in axios defaults
        setToken(authData.token);
        setIsAuthenticated(true);
        await fetchUserData();
        console.log('Social authentication successful');
        return true;
      } else {
        throw new Error(authData.message || 'Social authentication failed');
      }
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      console.error("Social auth error:", errorMsg);
      toast.error(`Social authentication failed: ${errorMsg}`);
      return false;
    }
  }, [fetchUserData, getErrorMessage]);

  // Google Authentication
  const googleAuth = useCallback(async (authData) => {
    return await handleSocialAuth(authData);
  }, [handleSocialAuth]);

  // Facebook Authentication
  const facebookAuth = useCallback(async (authData) => {
    return await handleSocialAuth(authData);
  }, [handleSocialAuth]);

  // Logout User
  const logout = useCallback(() => {
    // Logout from social platforms
    logoutFromSocial('google');
    logoutFromSocial('facebook');
    
    // Clear local storage and state
    localStorage.removeItem('sproutSphereToken');
    localStorage.removeItem('rememberedEmail');
    localStorage.removeItem('rememberMe');
    setAuthToken(null); // Remove token from axios defaults
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
    console.log('Logout successful');
    toast.success('Logged out successfully');
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    token,
    isAuthenticated,
    user,
    loading,
    error,
    register,
    login,
    logout,
    googleAuth,
    facebookAuth,
    fetchUserData
  }), [
    token,
    isAuthenticated,
    user,
    loading,
    error,
    register,
    login,
    logout,
    googleAuth,
    facebookAuth,
    fetchUserData
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};