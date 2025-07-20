import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5003/api';

export const getAuthHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('sproutSphereToken');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

const handleApiError = (error, defaultMessage = 'An error occurred') => {
  const errorMessage = error.response?.data?.message || error.message || defaultMessage;
  console.error('API Error:', errorMessage, error);
  toast.error(errorMessage);
  return { success: false, message: errorMessage, data: null };
};

const updateUserProfile = async (profileData) => {
  try {
    const res = await axios.put(`${API_URL}/auth/profile`, profileData, { headers: getAuthHeaders() });
    return { success: true, data: res.data };
  } catch (error) {
    return handleApiError(error, 'Could not update profile');
  }
};

const uploadAvatar = async (avatarFormData) => {
  try {
    const res = await axios.put(`${API_URL}/auth/avatar`, avatarFormData, { headers: getAuthHeaders(true) });
    return { success: true, data: res.data };
  } catch (error) {
    return handleApiError(error, 'Could not upload avatar');
  }
};

export const userService = {
  updateUserProfile,
  uploadAvatar,
  getAuthHeaders,
}; 