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
import { testConnection, getBaseURL } from './config/api';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

// Server Wake Component - Auto-wakes Render server on app start
const ServerWake = () => {
  const [waking, setWaking] = useState(true);
  const [status, setStatus] = useState('Connecting to server...');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const wakeServer = async () => {
      try {
        const baseURL = getBaseURL();
        console.log('🔄 Waking server:', baseURL);
        setStatus('Waking server...');
        
        // Show progress animation
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 90) return prev;
            return prev + 10;
          });
        }, 1000);
        
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);
        
        const response = await fetch(`${baseURL}/api/health`, {
          signal: controller.signal
        });
        
        clearTimeout(timeout);
        clearInterval(progressInterval);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Server awake:', data);
          setProgress(100);
          setStatus('Server ready! ✅');
          setTimeout(() => setWaking(false), 800);
        } else {
          throw new Error('Server not responding');
        }
      } catch (error) {
        console.error('❌ Wake failed:', error);
        if (error.name === 'AbortError') {
          setStatus('Server is starting... Please wait.');
        } else {
          setStatus('Connection issue. Check internet.');
        }
        setTimeout(() => setWaking(false), 3000);
      }
    };
    
    wakeServer();
  }, []);

  if (!waking) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      color: 'white',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{
        fontSize: '64px',
        marginBottom: '20px',
        animation: 'pulse 1.5s ease-in-out infinite'
      }}>
        📡
      </div>
      <h2 style={{ 
        marginBottom: '10px', 
        fontSize: '28px',
        fontWeight: 'bold'
      }}>
        Thazema
      </h2>
      <p style={{ 
        fontSize: '16px', 
        opacity: 0.9,
        marginBottom: '20px'
      }}>
        {status}
      </p>
      <div style={{
        width: '200px',
        height: '4px',
        background: 'rgba(255,255,255,0.3)',
        borderRadius: '2px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: 'white',
          transition: 'width 0.3s ease'
        }} />
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
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
          <ServerWake />
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
