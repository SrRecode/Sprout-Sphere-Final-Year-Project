import axios from 'axios';

// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5003/api';

// API Endpoints
export const ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_URL}/auth/login`,
    REGISTER: `${API_URL}/auth/register`,
    GOOGLE: `${API_URL}/auth/google`,
    FACEBOOK: `${API_URL}/auth/facebook`,
    USER: `${API_URL}/auth/user`,
    RESET_PASSWORD: `${API_URL}/auth/reset-password`,
    VERIFY_RESET: (token) => `${API_URL}/auth/reset-password/${token}/verify`,
    COMPLETE_RESET: (token) => `${API_URL}/auth/reset-password/${token}`,
    TWO_FACTOR_SETUP: `${API_URL}/auth/2fa/setup`,
    TWO_FACTOR_VERIFY: `${API_URL}/auth/2fa/verify`,
    PROFILE: `${API_URL}/auth/profile`,
    AVATAR: `${API_URL}/auth/avatar`,
  },
  
  // Plant endpoints
  PLANTS: {
    ALL: `${API_URL}/plants`,
    BY_ID: (id) => `${API_URL}/plants/${id}`,
  },
  
  // AI endpoints
  AI: {
    RECOMMENDATIONS: `${API_URL}/recommendations`,
    PLANT_CHAT: `${API_URL}/plant-chat`,
    DISEASE_DETECTION: `${API_URL}/ai/disease-detection`,
    CARE_ASSISTANT: `${API_URL}/ai/care-assistant`,
    VOICE_RECOGNITION: `${API_URL}/ai/voice-recognition`,
    PLANT_IDENTIFICATION: `${API_URL}/ai/plant-identification`,
  },
  
  // User endpoints
  USER: {
    PREFERENCES: `${API_URL}/user/preferences`,
    CARE_HISTORY: `${API_URL}/user/care-history`,
    WEATHER_RECOMMENDATIONS: `${API_URL}/user/weather-recommendations`,
  },
  
  // Social endpoints
  SOCIAL: {
    POSTS: `${API_URL}/social/posts`,
    COMMENTS: `${API_URL}/social/comments`,
    LIKES: `${API_URL}/social/likes`,
    NOTIFICATIONS: `${API_URL}/social/notifications`,
  },
};

// Helper function to get auth headers (for explicit header usage)
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

// Helper function to handle API errors
export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  const errorMessage = error.response?.data?.message || error.message || defaultMessage;
  console.error('API Error:', errorMessage, error);
  return { success: false, message: errorMessage, data: null };
};

// Configure axios defaults

// Set base URL
axios.defaults.baseURL = API_URL;

// Add request interceptor to ensure token is always included
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sproutSphereToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem('sproutSphereToken');
      delete axios.defaults.headers.common['Authorization'];
      
      // Only redirect if not already on login/signup pages
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
); 