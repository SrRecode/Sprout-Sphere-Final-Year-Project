import React, { createContext, useContext, useState, useEffect } from 'react';
import { userPreferencesService } from '../services/userPreferencesService';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const UserPreferencesContext = createContext();

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};

export const UserPreferencesProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [preferences, setPreferences] = useState(null);
  const [careHistory, setCareHistory] = useState([]);
  const [weatherRecommendations, setWeatherRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const [prefs, history, weather] = await Promise.all([
          userPreferencesService.getPreferences(),
          userPreferencesService.getCareHistory(),
          userPreferencesService.getWeatherRecommendations()
        ]);

        setPreferences(prefs);
        setCareHistory(history);
        setWeatherRecommendations(weather);
      } catch (error) {
        console.error('Error loading user data:', error);
        toast.error('Failed to load user preferences');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [isAuthenticated]);

  const savePreferences = async (newPreferences) => {
    if (!isAuthenticated) {
      toast.error('Please log in to save preferences');
      return;
    }

    try {
      const response = await userPreferencesService.savePreferences(newPreferences);
      setPreferences(response);
      toast.success('Preferences saved successfully');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
      throw error;
    }
  };

  const addToCareHistory = async (plantId, action) => {
    if (!isAuthenticated) {
      toast.error('Please log in to add care history');
      return;
    }

    try {
      const response = await userPreferencesService.addToCareHistory(plantId, action);
      setCareHistory(prev => [...prev, response]);
      toast.success('Added to care history');
    } catch (error) {
      console.error('Error adding to care history:', error);
      toast.error('Failed to add to care history');
      throw error;
    }
  };

  const getPersonalizedCareTips = async (plantId) => {
    if (!isAuthenticated) {
      toast.error('Please log in to get care tips');
      return null;
    }

    try {
      const response = await userPreferencesService.getPersonalizedCareTips(plantId);
      return response;
    } catch (error) {
      console.error('Error getting care tips:', error);
      toast.error('Failed to get care tips');
      return null;
    }
  };

  const value = {
    preferences,
    careHistory,
    weatherRecommendations,
    loading,
    savePreferences,
    addToCareHistory,
    getPersonalizedCareTips
  };

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

export default UserPreferencesContext; 