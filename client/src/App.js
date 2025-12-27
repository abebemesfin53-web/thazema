import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import AdminPanel from './pages/AdminPanel';
import AdminAI from './components/AdminAI';
import MobileDebug from './components/MobileDebug';
import ConnectionTest from './components/ConnectionTest';
import { Capacitor } from '@capacitor/core';
import { testConnection } from './config/api';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const [showConnectionTest, setShowConnectionTest] = useState(false);
  const [connectionChecked, setConnectionChecked] = useState(false);

  // Check connection on mobile startup
  useEffect(() => {
    if (Capacitor.isNativePlatform() && !connectionChecked) {
      const checkConnection = async () => {
        try {
          const isConnected = await testConnection();
          if (!isConnected) {
            setShowConnectionTest(true);
          }
        } catch (error) {
          console.log('Connection check failed, showing diagnostic');
          setShowConnectionTest(true);
        }
        setConnectionChecked(true);
      };
      
      // Delay to allow app to load
      setTimeout(checkConnection, 2000);
    }
  }, [connectionChecked]);

  // Show connection test on mobile for debugging or if forced
  if (Capacitor.isNativePlatform() && (window.location.search.includes('test') || showConnectionTest)) {
    return (
      <div>
        <ConnectionTest />
        {showConnectionTest && (
          <button
            onClick={() => setShowConnectionTest(false)}
            style={{
              position: 'fixed',
              top: '10px',
              right: '10px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              zIndex: 10000
            }}
          >
            Skip Test
          </button>
        )}
      </div>
    );
  }

  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <div className="App">
            <MobileDebug />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route 
                path="/admin" 
                element={
                  <PrivateRoute>
                    <AdminPanel />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
            {/* AI Assistant - Always visible */}
            <AdminAI />
          </div>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
