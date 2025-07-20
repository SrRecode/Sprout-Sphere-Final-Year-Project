import axios from 'axios';
import { API_URL, getAuthHeaders, handleApiError } from '../config/api';

// Social/Following Services
export const followUser = async (userId) => {
  try {
    const response = await axios.put(`${API_URL}/social/follow/${userId}`, {}, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to follow user');
  }
};

export const getUserProfile = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/social/profile/${userId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to get user profile');
  }
};

export const getFollowers = async (userId, page = 1) => {
  try {
    const response = await axios.get(`${API_URL}/social/followers/${userId}?page=${page}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to get followers');
  }
};

export const getFollowing = async (userId, page = 1) => {
  try {
    const response = await axios.get(`${API_URL}/social/following/${userId}?page=${page}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to get following');
  }
};

export const getUserFeed = async (page = 1) => {
  try {
    const response = await axios.get(`${API_URL}/social/feed?page=${page}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to get user feed');
  }
};

export const searchUsers = async (query, page = 1) => {
  try {
    const response = await axios.get(`${API_URL}/social/search?q=${encodeURIComponent(query)}&page=${page}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to search users');
  }
};

// Notification Services
export const getNotifications = async (page = 1) => {
  try {
    const response = await axios.get(`${API_URL}/notifications?page=${page}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to get notifications');
  }
};

export const getNotificationCount = async () => {
  try {
    const response = await axios.get(`${API_URL}/notifications/count`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to get notification count');
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await axios.put(`${API_URL}/notifications/${notificationId}/read`, {}, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to mark notification as read');
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const response = await axios.put(`${API_URL}/notifications/read-all`, {}, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to mark all notifications as read');
  }
};

export const deleteNotification = async (notificationId) => {
  try {
    const response = await axios.delete(`${API_URL}/notifications/${notificationId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to delete notification');
  }
};

export const updateNotificationPreferences = async (preferences) => {
  try {
    const response = await axios.put(`${API_URL}/notifications/preferences`, preferences, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to update notification preferences');
  }
}; 