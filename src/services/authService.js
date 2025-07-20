import axios from 'axios';
import { API_URL, getAuthHeaders, handleApiError } from '../config/api';

export const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Failed to register user');
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Failed to login');
    }
  },

  // Get current user data
  getCurrentUser: async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/user`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Failed to get user data');
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await axios.put(`${API_URL}/auth/profile`, profileData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Failed to update profile');
    }
  },

  // Get all users (Admin only)
  getAllUsers: async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/users`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Failed to get users');
    }
  },

  // Delete a user (Admin only)
  deleteUser: async (userId) => {
    try {
      const response = await axios.delete(`${API_URL}/users/${userId}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Failed to delete user');
    }
  },

  // Logout (client-side only)
  logout: () => {
    localStorage.removeItem('sproutSphereToken');
    localStorage.removeItem('rememberedEmail');
    localStorage.removeItem('rememberMe');
  }
}; 