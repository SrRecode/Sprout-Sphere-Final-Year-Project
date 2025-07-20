import axios from 'axios';
import { API_URL, getAuthHeaders, handleApiError } from '../config/api';

export const plantService = {
  // Get all plants
  getAllPlants: async () => {
    try {
      const response = await axios.get(`${API_URL}/plants`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Failed to fetch plants');
    }
  },

  // Get a single plant by ID
  getPlantById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/plants/${id}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Failed to fetch plant');
    }
  },

  // Create a new plant
  createPlant: async (plantData) => {
    try {
      const response = await axios.post(`${API_URL}/plants`, plantData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Failed to create plant');
    }
  },

  // Update a plant
  updatePlant: async (id, plantData) => {
    try {
      const response = await axios.put(`${API_URL}/plants/${id}`, plantData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Failed to update plant');
    }
  },

  // Delete a plant
  deletePlant: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/plants/${id}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Failed to delete plant');
    }
  },

  // Search plants
  searchPlants: async (query) => {
    try {
      const response = await axios.get(`${API_URL}/plants/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Failed to search plants');
    }
  },

  // Get plants by category
  getPlantsByCategory: async (category) => {
    try {
      const response = await axios.get(`${API_URL}/plants/category/${encodeURIComponent(category)}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Failed to fetch plants by category');
    }
  },

  // Get plants with filters
  getPlantsWithFilters: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });
      
      const response = await axios.get(`${API_URL}/plants?${params.toString()}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Failed to fetch plants with filters');
    }
  },

  // Get featured plants
  getFeaturedPlants: async () => {
    try {
      const response = await axios.get(`${API_URL}/plants/featured`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Failed to fetch featured plants');
    }
  },

  // Get trending plants
  getTrendingPlants: async () => {
    try {
      const response = await axios.get(`${API_URL}/plants/trending`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Failed to fetch trending plants');
    }
  }
}; 