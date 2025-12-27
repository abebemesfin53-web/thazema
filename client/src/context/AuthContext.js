import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { createURL, API_ENDPOINTS } from '../config/api';
import { storage } from '../utils/storage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const storedToken = await storage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        await fetchUser();
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      console.log('Fetching user from:', createURL(API_ENDPOINTS.AUTH.ME));
      const response = await axios.get(createURL(API_ENDPOINTS.AUTH.ME));
      setUser(response.data.user);
      console.log('User fetched successfully:', response.data.user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      console.error('Error details:', error.response?.data || error.message);
      logout();
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Attempting login to:', createURL(API_ENDPOINTS.AUTH.LOGIN));
      const response = await axios.post(createURL(API_ENDPOINTS.AUTH.LOGIN), { email, password });
      const { token, user } = response.data;
      
      await storage.setItem('token', token);
      setToken(token);
      setUser(user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      console.log('Login successful:', user);
      return user;
    } catch (error) {
      console.error('Login failed:', error);
      console.error('Error details:', error.response?.data || error.message);
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
      console.log('Attempting registration to:', createURL(API_ENDPOINTS.AUTH.REGISTER));
      const response = await axios.post(createURL(API_ENDPOINTS.AUTH.REGISTER), { username, email, password });
      const { token, user } = response.data;
      
      await storage.setItem('token', token);
      setToken(token);
      setUser(user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      console.log('Registration successful:', user);
      return user;
    } catch (error) {
      console.error('Registration failed:', error);
      console.error('Error details:', error.response?.data || error.message);
      throw error;
    }
  };

  const loginWithPhone = async (phone) => {
    try {
      console.log('Sending OTP to:', createURL(API_ENDPOINTS.AUTH.SEND_OTP));
      const response = await axios.post(createURL(API_ENDPOINTS.AUTH.SEND_OTP), { phone });
      console.log('OTP sent successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Send OTP failed:', error);
      console.error('Error details:', error.response?.data || error.message);
      throw error;
    }
  };

  const verifyOTP = async (phone, otp) => {
    try {
      console.log('Verifying OTP to:', createURL(API_ENDPOINTS.AUTH.VERIFY_OTP));
      const response = await axios.post(createURL(API_ENDPOINTS.AUTH.VERIFY_OTP), { phone, otp });
      const { token, user } = response.data;
      
      await storage.setItem('token', token);
      setToken(token);
      setUser(user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      console.log('OTP verification successful:', user);
      return user;
    } catch (error) {
      console.error('OTP verification failed:', error);
      console.error('Error details:', error.response?.data || error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await storage.removeItem('token');
      setToken(null);
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, loginWithPhone, verifyOTP, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
