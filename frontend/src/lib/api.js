// lib/api.js

import axios from 'axios';

// Set up base URL from environment variable or use a default value
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout
  timeout: 15000,
});

// Add request interceptor to attach auth token
apiClient.interceptors.request.use(
  (config) => {
    
    // Get token from localStorage if in browser context
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');  
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn("No authentication token found - this might cause 401 errors");
      }
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    // Log the response (remove in production)
    return response;
  },
  async (error) => {
    // Log the error for debugging
    console.error('API Response Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    
    // Handle token expiration, network errors, etc.
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      if (typeof window !== 'undefined') {
        console.log('401 Unauthorized - clearing token');
        localStorage.removeItem('token');
        
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login?redirect=' + window.location.pathname;
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;