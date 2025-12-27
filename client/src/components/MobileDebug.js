import React, { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { testConnection, getBaseURL } from '../config/api';

const MobileDebug = () => {
  const [debugInfo, setDebugInfo] = useState({});
  const [connectionTest, setConnectionTest] = useState(null);

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    const info = {
      platform: Capacitor.getPlatform(),
      isNative: Capacitor.isNativePlatform(),
      baseURL: getBaseURL(),
      timestamp: new Date().toISOString()
    };

    setDebugInfo(info);

    // Test connection
    try {
      const isConnected = await testConnection();
      setConnectionTest(isConnected);
    } catch (error) {
      setConnectionTest(false);
      console.error('Connection test error:', error);
    }
  };

  const testDirectConnection = async () => {
    try {
      const baseURL = getBaseURL();
      const response = await fetch(`${baseURL}/api/health`);
      const data = await response.json();
      alert(`Connection Success!\n${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      alert(`Connection Failed!\n${error.message}`);
    }
  };

  if (!Capacitor.isNativePlatform()) {
    return null; // Only show on mobile
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: '#000',
      color: '#0ea5e9',
      padding: '10px',
      fontSize: '12px',
      zIndex: 9999,
      borderBottom: '2px solid #0ea5e9'
    }}>
      <div><strong>Mobile Debug Info:</strong></div>
      <div>Platform: {debugInfo.platform}</div>
      <div>Native: {debugInfo.isNative ? 'Yes' : 'No'}</div>
      <div>Server: {debugInfo.baseURL}</div>
      <div>Connection: {connectionTest === null ? 'Testing...' : connectionTest ? '✅ OK' : '❌ Failed'}</div>
      <button 
        onClick={testDirectConnection}
        style={{
          backgroundColor: '#0ea5e9',
          color: 'white',
          border: 'none',
          padding: '5px 10px',
          marginTop: '5px',
          borderRadius: '3px'
        }}
      >
        Test Connection
      </button>
    </div>
  );
};

export default MobileDebug;