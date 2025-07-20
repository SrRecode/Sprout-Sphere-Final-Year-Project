/**
 * Authentication utilities
 * This module provides helper functions for authentication including social login
 */

import axios from 'axios';
import { API_URL } from '../config/api';

/**
 * Initialize Google OAuth client
 * @returns {Promise<void>}
 */
export const initGoogleAuth = async () => {
  return new Promise((resolve, reject) => {
    // Check if Google API is already loaded
    if (window.google && window.google.accounts) {
      resolve();
      return;
    }

    // Load the Google Sign-In API script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // Initialize Google Sign-In
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '123456789-example.apps.googleusercontent.com',
          auto_select: false,
          cancel_on_tap_outside: true
        });
        resolve();
      } else {
        reject(new Error('Google API failed to load properly'));
      }
    };
    script.onerror = () => {
      reject(new Error('Failed to load Google API script'));
    };
    document.body.appendChild(script);
  });
};

/**
 * Handle Google OAuth login
 * @param {Function} onSuccess - Callback function on successful login
 * @param {Function} onError - Callback function on login error
 */
export const handleGoogleLogin = (onSuccess, onError) => {
  // Make sure the Google client is loaded
  if (!window.google || !window.google.accounts) {
    onError(new Error('Google API not loaded. Please try again.'));
    return;
  }

  try {
    // Create a promise-based wrapper for Google Sign-In
    const googleSignInPromise = new Promise((resolve, reject) => {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          reject(new Error('Google Sign-In prompt was not displayed or was skipped'));
          return;
        }
      });

      // Listen for the credential response
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '123456789-example.apps.googleusercontent.com',
        callback: async (response) => {
          if (response.credential) {
            try {
              // Send the token to your backend
              const result = await axios.post(`${API_URL}/auth/google`, {
                token: response.credential
              });
              
              if (result.data.success) {
                resolve(result.data);
              } else {
                reject(new Error(result.data.message || 'Google authentication failed'));
              }
            } catch (err) {
              reject(err);
            }
          } else {
            reject(new Error('No credential received from Google'));
          }
        },
        auto_select: false
      });
    });

    // Handle the promise
    googleSignInPromise
      .then(onSuccess)
      .catch(onError);

  } catch (err) {
    onError(err);
  }
};

/**
 * Handle Facebook login
 * @param {Function} onSuccess - Callback function on successful login
 * @param {Function} onError - Callback function on login error
 */
export const handleFacebookLogin = (onSuccess, onError) => {
  // Make sure the Facebook SDK is loaded
  if (!window.FB) {
    onError(new Error('Facebook SDK not loaded. Please try again.'));
    return;
  }

  // Check login status first
  window.FB.getLoginStatus((response) => {
    if (response.status === 'connected') {
      // User is already logged in, proceed with authentication
      authenticateWithFacebook(response.authResponse, onSuccess, onError);
    } else {
      // User needs to log in
      window.FB.login((loginResponse) => {
        if (loginResponse.authResponse) {
          authenticateWithFacebook(loginResponse.authResponse, onSuccess, onError);
        } else {
          onError(new Error('User cancelled login or did not fully authorize'));
        }
      }, { 
        scope: 'email,public_profile',
        return_scopes: true
      });
    }
  });
};

/**
 * Helper function to authenticate with Facebook backend
 * @param {Object} authResponse - Facebook auth response
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
const authenticateWithFacebook = async (authResponse, onSuccess, onError) => {
  try {
    // Get user info from Facebook
    window.FB.api('/me', { fields: 'id,name,email' }, async (userResponse) => {
      if (userResponse.error) {
        onError(new Error('Failed to get user info from Facebook'));
        return;
      }

      try {
        // Send the token and user info to your backend
        const result = await axios.post(`${API_URL}/auth/facebook`, {
          accessToken: authResponse.accessToken,
          userID: authResponse.userID,
          userInfo: userResponse
        });
        
        if (result.data.success) {
          onSuccess(result.data);
        } else {
          onError(new Error(result.data.message || 'Facebook authentication failed'));
        }
      } catch (err) {
        onError(err);
      }
    });
  } catch (err) {
    onError(err);
  }
};

/**
 * Initialize Facebook SDK
 * @returns {Promise<void>}
 */
export const initFacebookAuth = async () => {
  return new Promise((resolve, reject) => {
    // Check if Facebook SDK is already loaded
    if (window.FB) {
      resolve();
      return;
    }

    // Load the Facebook SDK
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: import.meta.env.VITE_FACEBOOK_APP_ID || '123456789',
        cookie: true,
        xfbml: true,
        version: 'v17.0'
      });
      
      // Check if initialization was successful
      if (window.FB) {
        resolve();
      } else {
        reject(new Error('Facebook SDK failed to initialize'));
      }
    };
    
    // Load Facebook SDK script
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        resolve();
        return;
      }
      js = d.createElement(s); 
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      js.onerror = () => {
        reject(new Error('Failed to load Facebook SDK script'));
      };
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  });
};

/**
 * Request password reset
 * @param {string} email - User's email address
 * @returns {Promise<Object>} Response from the server
 */
export const requestPasswordReset = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/auth/reset-password`, { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Verify password reset token
 * @param {string} token - Password reset token
 * @returns {Promise<Object>} Response from the server
 */
export const verifyResetToken = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/auth/reset-password/${token}/verify`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Complete password reset
 * @param {string} token - Password reset token
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Response from the server
 */
export const completePasswordReset = async (token, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/auth/reset-password/${token}`, { 
      password: newPassword 
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Setup two-factor authentication
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Response with QR code data
 */
export const setupTwoFactorAuth = async (userId) => {
  try {
    const response = await axios.post(`${API_URL}/auth/2fa/setup`, { userId });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Verify two-factor authentication token
 * @param {string} userId - User ID
 * @param {string} token - 2FA token
 * @returns {Promise<Object>} Response from the server
 */
export const verifyTwoFactorToken = async (userId, token) => {
  try {
    const response = await axios.post(`${API_URL}/auth/2fa/verify`, { 
      userId,
      token 
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Logout from social platforms
 * @param {string} platform - 'google' or 'facebook'
 */
export const logoutFromSocial = (platform) => {
  try {
    if (platform === 'google' && window.google && window.google.accounts) {
      window.google.accounts.id.disableAutoSelect();
    } else if (platform === 'facebook' && window.FB) {
      window.FB.logout();
    }
  } catch (error) {
    console.error(`Error logging out from ${platform}:`, error);
  }
};

/**
 * Check if social platforms are ready
 * @returns {Object} Status of social platforms
 */
export const checkSocialAuthStatus = () => {
  return {
    google: !!(window.google && window.google.accounts),
    facebook: !!window.FB
  };
};

/**
 * Get user info from social platforms
 * @param {string} platform - 'google' or 'facebook'
 * @returns {Promise<Object>} User information
 */
export const getSocialUserInfo = async (platform) => {
  if (platform === 'facebook' && window.FB) {
    return new Promise((resolve, reject) => {
      window.FB.api('/me', { fields: 'id,name,email,picture' }, (response) => {
        if (response.error) {
          reject(new Error('Failed to get Facebook user info'));
        } else {
          resolve(response);
        }
      });
    });
  }
  
  throw new Error(`Unsupported platform: ${platform}`);
};

/**
 * Validate social authentication configuration
 * @returns {Object} Configuration status
 */
export const validateSocialConfig = () => {
  const config = {
    google: {
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      isValid: !!import.meta.env.VITE_GOOGLE_CLIENT_ID && 
               import.meta.env.VITE_GOOGLE_CLIENT_ID !== '123456789-example.apps.googleusercontent.com'
    },
    facebook: {
      appId: import.meta.env.VITE_FACEBOOK_APP_ID,
      isValid: !!import.meta.env.VITE_FACEBOOK_APP_ID && 
               import.meta.env.VITE_FACEBOOK_APP_ID !== '123456789'
    }
  };

  return {
    ...config,
    allValid: config.google.isValid && config.facebook.isValid,
    hasAnyValid: config.google.isValid || config.facebook.isValid
  };
}; 