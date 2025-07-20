import axios from 'axios';
import { API_URL, getAuthHeaders, handleApiError } from '../config/api';

export const userPreferencesService = {
  // Save user preferences
  savePreferences: async (preferences) => {
    try {
      const response = await axios.post(`${API_URL}/user/preferences`, preferences, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Failed to save preferences');
    }
  },

  // Get user preferences
  getPreferences: async () => {
    try {
      const response = await axios.get(`${API_URL}/user/preferences`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Failed to get preferences');
    }
  },

  // Add to care history
  addToCareHistory: async (plantId, action) => {
    try {
      const response = await axios.post(`${API_URL}/user/care-history/${plantId}`, action, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Failed to add to care history');
    }
  },

  // Get care history
  getCareHistory: async () => {
    try {
      const response = await axios.get(`${API_URL}/user/care-history`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Failed to get care history');
    }
  },

  // Get personalized care tips
  getPersonalizedCareTips: async (plantId) => {
    try {
      const response = await axios.get(`${API_URL}/user/care-tips/${plantId}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Failed to get care tips');
    }
  },

  // Get weather recommendations
  getWeatherRecommendations: async () => {
    try {
      const response = await axios.get(`${API_URL}/user/weather-recommendations`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Failed to get weather recommendations');
    }
  }
}; 