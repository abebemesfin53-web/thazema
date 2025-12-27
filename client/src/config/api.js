// API Configuration for Web and Mobile
import { Capacitor } from '@capacitor/core';

// Detect if running on mobile device
const isNative = Capacitor.isNativePlatform();

// Server configuration
const SERVER_CONFIG = {
  // For local development
  LOCAL_IP: '192.168.0.97',
  PORT: '5000',
  
  // For production - UPDATE THIS WITH YOUR RAILWAY/RENDER URL
  PRODUCTION_URL: 'https://thazema.onrender.com',
  
  // SET TO TRUE FOR PLAY STORE RELEASE
  USE_PRODUCTION: true
};

// Get the base URL based on platform and environment
export const getBaseURL = () => {
  // For production release, always use production URL
  if (SERVER_CONFIG.USE_PRODUCTION) {
    console.log('Using production server:', SERVER_CONFIG.PRODUCTION_URL);
    return SERVER_CONFIG.PRODUCTION_URL;
  }
  
  // For development
  if (isNative) {
    const url = `http://${SERVER_CONFIG.LOCAL_IP}:${SERVER_CONFIG.PORT}`;
    console.log('Mobile dev - using local server:', url);
    return url;
  }
  
  if (window.location.hostname === 'localhost') {
    const url = `http://localhost:${SERVER_CONFIG.PORT}`;
    console.log('Web dev - using local server:', url);
    return url;
  }
  
  return SERVER_CONFIG.PRODUCTION_URL;
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    SEND_OTP: '/api/auth/send-otp',
    VERIFY_OTP: '/api/auth/verify-otp',
    ME: '/api/auth/me'
  },
  USERS: {
    ALL: '/api/users',
    NEARBY: '/api/users/nearby'
  }
};

// Create full URL
export const createURL = (endpoint) => {
  return `${getBaseURL()}${endpoint}`;
};

// Test server connection
export const testConnection = async () => {
  try {
    const response = await fetch(`${getBaseURL()}/api/health`);
    return response.ok;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
};

const apiConfig = {
  getBaseURL,
  API_ENDPOINTS,
  createURL,
  testConnection,
  isNative,
  SERVER_CONFIG
};

export default apiConfig;