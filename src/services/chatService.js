import axios from 'axios';
import { API_URL, getAuthHeaders, handleApiError } from '../config/api';

export const sendMessage = async (message, sessionId = null) => {
  try {
    const response = await axios.post(`${API_URL}/plant-chat`, {
      message,
      sessionId,
    }, {
      headers: getAuthHeaders()
    });

    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to send message');
  }
};

export const getChatHistory = async (sessionId) => {
  try {
    const response = await axios.get(`${API_URL}/plant-chat/history/${sessionId}`, {
      headers: getAuthHeaders()
    });

    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to fetch chat history');
  }
}; 