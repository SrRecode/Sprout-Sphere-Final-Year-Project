import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL, getAuthHeaders } from '../config/api';
import { toast } from 'react-toastify';

const AITestComponent = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const results = {};

    try {
      // Test 1: Health check (no auth required)
      console.log('Testing AI health check...');
      const healthResponse = await axios.get(`${API_URL}/ai/health`);
      results.health = healthResponse.data.success ? 'PASS' : 'FAIL';
      console.log('Health check result:', healthResponse.data);

      // Test 2: Test initialization (no auth required)
      console.log('Testing AI initialization...');
      const initResponse = await axios.post(`${API_URL}/ai/test-initialize`);
      results.initialization = initResponse.data.success ? 'PASS' : 'FAIL';
      console.log('Initialization result:', initResponse.data);

      // Test 3: Auth check
      console.log('Testing authentication...');
      const token = localStorage.getItem('sproutSphereToken');
      if (token) {
        try {
          const authResponse = await axios.get(`${API_URL}/auth/user`, {
            headers: getAuthHeaders()
          });
          results.authentication = authResponse.data ? 'PASS' : 'FAIL';
          console.log('Auth check result:', authResponse.data);
        } catch (error) {
          results.authentication = 'FAIL';
          console.error('Auth check failed:', error.response?.data);
        }
      } else {
        results.authentication = 'NO_TOKEN';
      }

      // Test 4: Protected AI endpoint
      console.log('Testing protected AI endpoint...');
      if (token) {
        try {
          const protectedResponse = await axios.post(`${API_URL}/ai/disease-detection/initialize`, {}, {
            headers: getAuthHeaders()
          });
          results.protectedEndpoint = protectedResponse.data.success ? 'PASS' : 'FAIL';
          console.log('Protected endpoint result:', protectedResponse.data);
        } catch (error) {
          results.protectedEndpoint = 'FAIL';
          console.error('Protected endpoint failed:', error.response?.data);
        }
      } else {
        results.protectedEndpoint = 'NO_TOKEN';
      }

    } catch (error) {
      console.error('Test error:', error);
      toast.error('Test failed: ' + error.message);
    }

    setTestResults(results);
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PASS': return 'text-green-600';
      case 'FAIL': return 'text-red-600';
      case 'NO_TOKEN': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PASS': return '✅ PASS';
      case 'FAIL': return '❌ FAIL';
      case 'NO_TOKEN': return '⚠️ NO TOKEN';
      default: return '❓ UNKNOWN';
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-dark-800 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        AI Services Test
      </h3>
      
      <button
        onClick={runTests}
        disabled={loading}
        className="mb-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
      >
        {loading ? 'Running Tests...' : 'Run Tests'}
      </button>

      {Object.keys(testResults).length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700 dark:text-gray-300">Test Results:</h4>
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
      )}

      <div className="mt-4 p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
        <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Debug Info:</h4>
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <div>API URL: {API_URL}</div>
          <div>Token: {localStorage.getItem('sproutSphereToken') ? 'Present' : 'Missing'}</div>
          <div>User Agent: {navigator.userAgent.substring(0, 50)}...</div>
        </div>
      </div>
    </div>
  );
};

export default AITestComponent; 