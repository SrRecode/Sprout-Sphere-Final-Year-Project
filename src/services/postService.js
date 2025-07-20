import axios from 'axios';
import { API_URL, getAuthHeaders, handleApiError } from '../config/api';

const getAllPosts = async () => {
  try {
    const res = await axios.get(`${API_URL}/posts`);
    return res.data;
  } catch (error) {
    return handleApiError(error, 'Could not fetch posts');
  }
};

const createPost = async (postData) => {
  try {
    const res = await axios.post(`${API_URL}/posts`, postData, { headers: getAuthHeaders() });
    return res.data;
  } catch (error) {
    return handleApiError(error, 'Could not create post');
  }
};

const likePost = async (postId) => {
  try {
    const res = await axios.put(`${API_URL}/posts/${postId}/like`, {}, { headers: getAuthHeaders() });
    return res.data;
  } catch (error) {
    return handleApiError(error, 'Could not like post');
  }
};

const bookmarkPost = async (postId) => {
  try {
    const res = await axios.put(`${API_URL}/posts/${postId}/bookmark`, {}, { headers: getAuthHeaders() });
    return res.data;
  } catch (error) {
    return handleApiError(error, 'Could not bookmark post');
  }
};

const addComment = async (postId, content) => {
  try {
    const res = await axios.post(`${API_URL}/posts/${postId}/comments`, { content }, { headers: getAuthHeaders() });
    return res.data;
  } catch (error) {
    return handleApiError(error, 'Could not add comment');
  }
};

const likeComment = async (postId, commentId) => {
  try {
    const res = await axios.put(`${API_URL}/posts/${postId}/comments/${commentId}/like`, {}, { headers: getAuthHeaders() });
    return res.data;
  } catch (error) {
    return handleApiError(error, 'Could not like comment');
  }
};

const addReply = async (postId, commentId, content) => {
  try {
    const res = await axios.post(`${API_URL}/posts/${postId}/comments/${commentId}/replies`, { content }, { headers: getAuthHeaders() });
    return res.data;
  } catch (error) {
    return handleApiError(error, 'Could not add reply');
  }
};

const getBookmarkedPosts = async () => {
  try {
    const res = await axios.get(`${API_URL}/posts/bookmarks`, { headers: getAuthHeaders() });
    return res.data;
  } catch (error) {
    return handleApiError(error, 'Could not get bookmarked posts');
  }
};

export const postService = {
  getAllPosts,
  createPost,
  likePost,
  bookmarkPost,
  addComment,
  likeComment,
  addReply,
  getBookmarkedPosts,
}; 