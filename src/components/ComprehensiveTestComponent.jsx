import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/api';

const ComprehensiveTestComponent = () => {
  const { isAuthenticated, user, login, logout } = useAuth();
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [aiTestResults, setAiTestResults] = useState({});

  // Test form input persistence
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Test authentication
  const testAuthentication = async () => {
    setLoading(true);
    const results = {};

    try {
      // Test 1: Check if user is authenticated
      results.authStatus = isAuthenticated ? 'AUTHENTICATED' : 'NOT_AUTHENTICATED';
      
      if (isAuthenticated) {
        // Test 2: Test protected endpoint
        try {
          const response = await axios.get(`${API_URL}/auth/user`);
          results.userData = response.data ? 'SUCCESS' : 'FAILED';
          console.log('User data:', response.data);
        } catch (error) {
          results.userData = 'FAILED';
          console.error('User data fetch failed:', error.response?.data);
        }

        // Test 3: Test AI endpoints
        const aiEndpoints = [
          { name: 'diseaseDetection', url: `${API_URL}/ai/disease-detection/initialize` },
          { name: 'careAssistant', url: `${API_URL}/ai/care-assistant/initialize` },
          { name: 'plantIdentification', url: `${API_URL}/ai/plant-identification/initialize` },
          { name: 'voiceVocabulary', url: `${API_URL}/ai/voice-recognition/vocabulary` },
          { name: 'notifications', url: `${API_URL}/notifications?page=1` }
        ];

        for (const endpoint of aiEndpoints) {
          try {
            const response = await axios.post(endpoint.url, {});
            results[endpoint.name] = response.data.success ? 'SUCCESS' : 'FAILED';
            console.log(`${endpoint.name} result:`, response.data);
          } catch (error) {
            results[endpoint.name] = 'FAILED';
            console.error(`${endpoint.name} failed:`, error.response?.data);
          }
        }
      } else {
        results.userData = 'NOT_AUTHENTICATED';
        results.diseaseDetection = 'NOT_AUTHENTICATED';
        results.careAssistant = 'NOT_AUTHENTICATED';
        results.plantIdentification = 'NOT_AUTHENTICATED';
        results.voiceVocabulary = 'NOT_AUTHENTICATED';
        results.notifications = 'NOT_AUTHENTICATED';
      }

    } catch (error) {
      console.error('Test error:', error);
      toast.error('Test failed: ' + error.message);
    }

    setTestResults(results);
    setLoading(false);
  };

  // Test AI services specifically
  const testAIServices = async () => {
    setLoading(true);
    const results = {};

    try {
      // Test public AI endpoints
      const publicEndpoints = [
        { name: 'health', url: `${API_URL}/ai/health`, method: 'GET' },
        { name: 'testInitialize', url: `${API_URL}/ai/test-initialize`, method: 'POST' }
      ];

      for (const endpoint of publicEndpoints) {
        try {
          const response = endpoint.method === 'GET' 
            ? await axios.get(endpoint.url)
            : await axios.post(endpoint.url);
          results[endpoint.name] = response.data.success ? 'SUCCESS' : 'FAILED';
          console.log(`${endpoint.name} result:`, response.data);
        } catch (error) {
          results[endpoint.name] = 'FAILED';
          console.error(`${endpoint.name} failed:`, error.response?.data);
        }
      }

    } catch (error) {
      console.error('AI test error:', error);
      toast.error('AI test failed: ' + error.message);
    }

    setAiTestResults(results);
    setLoading(false);
  };

  // Test login functionality
  const testLogin = async () => {
    if (!formData.email || !formData.password) {
      toast.error('Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        toast.success('Login test successful!');
        setTimeout(() => {
          testAuthentication();
        }, 1000);
      } else {
        toast.error('Login test failed');
      }
    } catch (error) {
      toast.error('Login test error: ' + error.message);
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SUCCESS':
      case 'AUTHENTICATED':
        return 'text-green-600';
      case 'FAILED':
      case 'NOT_AUTHENTICATED':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'SUCCESS':
        return '✅ SUCCESS';
      case 'AUTHENTICATED':
        return '✅ AUTHENTICATED';
      case 'FAILED':
        return '❌ FAILED';
      case 'NOT_AUTHENTICATED':
        return '⚠️ NOT AUTHENTICATED';
      default:
        return '❓ UNKNOWN';
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-dark-800 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Comprehensive Test Suite
      </h2>

      {/* Form Input Test */}
      <div className="mb-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Form Input Test (Check for re-rendering issues)
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
              placeholder="test@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
              placeholder="password"
            />
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Current form data: {JSON.stringify(formData)}
          </div>
        </div>
      </div>

      {/* Authentication Status */}
      <div className="mb-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Authentication Status
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Status:</span>
            <span className={`font-medium ${getStatusColor(isAuthenticated ? 'AUTHENTICATED' : 'NOT_AUTHENTICATED')}`}>
              {getStatusText(isAuthenticated ? 'AUTHENTICATED' : 'NOT_AUTHENTICATED')}
            </span>
          </div>
          {user && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              User: {user.name} ({user.email})
            </div>
          )}
        </div>
      </div>

      {/* Test Buttons */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={testLogin}
            disabled={loading || isAuthenticated}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Login'}
          </button>
          
          <button
            onClick={testAuthentication}
            disabled={loading || !isAuthenticated}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Protected Endpoints'}
          </button>
          
          <button
            onClick={testAIServices}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test AI Services'}
          </button>
          
          {isAuthenticated && (
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Test Results */}
      {Object.keys(testResults).length > 0 && (
        <div className="mb-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Protected Endpoints Test Results
          </h3>
          <div className="space-y-2">
            {Object.entries(testResults).map(([test, result]) => (
              <div key={test} className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400 capitalize">
                  {test.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <span className={`font-medium ${getStatusColor(result)}`}>
                  {getStatusText(result)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Test Results */}
      {Object.keys(aiTestResults).length > 0 && (
        <div className="mb-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
            AI Services Test Results
          </h3>
          <div className="space-y-2">
            {Object.entries(aiTestResults).map(([test, result]) => (
              <div key={test} className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400 capitalize">
                  {test.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <span className={`font-medium ${getStatusColor(result)}`}>
                  {getStatusText(result)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Debug Info */}
      <div className="p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Debug Information
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <div>API URL: {API_URL}</div>
          <div>Token: {localStorage.getItem('sproutSphereToken') ? 'Present' : 'Missing'}</div>
          <div>Axios Default Auth: {axios.defaults.headers.common['Authorization'] ? 'Set' : 'Not Set'}</div>
          <div>User Agent: {navigator.userAgent.substring(0, 50)}...</div>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveTestComponent; 