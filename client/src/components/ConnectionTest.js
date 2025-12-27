import React, { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

const ConnectionTest = () => {
  const [testResults, setTestResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentTest, setCurrentTest] = useState('');

  const SERVER_IP = '10.14.28.123';
  const SERVER_PORT = '3001';
  const ALT_PORT = '8080';
  const BASE_URL = `http://${SERVER_IP}:${SERVER_PORT}`;
  const ALT_URL = `http://${SERVER_IP}:${ALT_PORT}`;

  const runConnectionTests = async () => {
    setIsLoading(true);
    const results = {};

    // Test 1: Basic connectivity to main server
    setCurrentTest('Testing main server connection...');
    try {
      console.log('Testing basic connectivity to main server...');
      const response = await fetch(`${BASE_URL}/api/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });
      const data = await response.json();
      results.basicConnection = { success: true, data, url: BASE_URL };
      console.log('✅ Main server connection successful:', data);
    } catch (error) {
      results.basicConnection = { success: false, error: error.message, url: BASE_URL };
      console.log('❌ Main server connection failed:', error);
    }

    // Test 2: Try alternative port if main fails
    if (!results.basicConnection.success) {
      setCurrentTest('Trying alternative server port...');
      try {
        console.log('Testing alternative port...');
        const response = await fetch(`${ALT_URL}/api/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        });
        const data = await response.json();
        results.altConnection = { success: true, data, url: ALT_URL };
        console.log('✅ Alternative server connection successful:', data);
      } catch (error) {
        results.altConnection = { success: false, error: error.message, url: ALT_URL };
        console.log('❌ Alternative server connection failed:', error);
      }
    }

    // Test 3: API endpoint test
    const testUrl = results.basicConnection.success ? BASE_URL : 
                   (results.altConnection?.success ? ALT_URL : BASE_URL);
    
    setCurrentTest('Testing API endpoints...');
    try {
      console.log('Testing API endpoint...');
      const response = await fetch(`${testUrl}/api/test`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });
      const data = await response.json();
      results.apiTest = { success: true, data, url: testUrl };
      console.log('✅ API test successful:', data);
    } catch (error) {
      results.apiTest = { success: false, error: error.message, url: testUrl };
      console.log('❌ API test failed:', error);
    }

    // Test 4: POST request (login simulation)
    setCurrentTest('Testing POST requests...');
    try {
      console.log('Testing POST request...');
      const response = await fetch(`${testUrl}/api/auth/test-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@test.com', password: 'test123' }),
        timeout: 10000
      });
      const data = await response.json();
      results.postTest = { success: true, data, url: testUrl };
      console.log('✅ POST test successful:', data);
    } catch (error) {
      results.postTest = { success: false, error: error.message, url: testUrl };
      console.log('❌ POST test failed:', error);
    }

    // Test 5: Network info
    setCurrentTest('Gathering network information...');
    results.networkInfo = {
      userAgent: navigator.userAgent,
      platform: Capacitor.getPlatform(),
      isNative: Capacitor.isNativePlatform(),
      timestamp: new Date().toISOString()
    };

    setTestResults(results);
    setIsLoading(false);
    setCurrentTest('');
  };

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      runConnectionTests();
    }
  }, []);

  if (!Capacitor.isNativePlatform()) {
    return (
      <div style={{ padding: '20px', color: 'white' }}>
        <h3>Connection Test (Web Mode)</h3>
        <p>This test only runs on mobile devices.</p>
      </div>
    );
  }

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      background: '#000', 
      color: 'white', 
      padding: '20px',
      overflow: 'auto',
      zIndex: 9999
    }}>
      <h2 style={{ color: '#0ea5e9', marginBottom: '20px' }}>
        📱 Thazema Connection Diagnostic
      </h2>
      
      <div style={{ marginBottom: '20px', background: '#1f2937', padding: '15px', borderRadius: '8px' }}>
        <strong>🌐 Server Configuration:</strong><br/>
        Primary: {BASE_URL}<br/>
        Alternative: {ALT_URL}<br/>
        Platform: {Capacitor.getPlatform()}<br/>
        Native: {Capacitor.isNativePlatform() ? 'Yes' : 'No'}
      </div>

      {isLoading && (
        <div style={{ 
          background: '#374151', 
          padding: '15px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <div style={{ color: '#0ea5e9', fontSize: '18px', marginBottom: '10px' }}>
            🔄 Testing Connection...
          </div>
          <div style={{ color: '#9ca3af' }}>
            {currentTest}
          </div>
        </div>
      )}

      <button 
        onClick={runConnectionTests}
        disabled={isLoading}
        style={{
          background: isLoading ? '#6b7280' : '#0ea5e9',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          marginBottom: '20px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        {isLoading ? '🔄 Testing...' : '🚀 Run Full Diagnostic'}
      </button>

      <div style={{ marginTop: '20px' }}>
        <h3 style={{ color: '#10b981', marginBottom: '15px' }}>📊 Test Results:</h3>
        
        {/* Primary Server Test */}
        <div style={{ 
          margin: '10px 0', 
          padding: '15px', 
          background: testResults.basicConnection?.success ? '#065f46' : '#7f1d1d',
          borderRadius: '8px',
          border: `2px solid ${testResults.basicConnection?.success ? '#10b981' : '#ef4444'}`
        }}>
          <strong>1. Primary Server ({SERVER_PORT}):</strong> {
            testResults.basicConnection?.success ? '✅ CONNECTED' : '❌ FAILED'
          }
          {testResults.basicConnection && (
            <div style={{ marginTop: '8px' }}>
              <div style={{ fontSize: '12px', color: '#d1d5db' }}>
                URL: {testResults.basicConnection.url}
              </div>
              <pre style={{ fontSize: '11px', marginTop: '5px', background: '#000', padding: '8px', borderRadius: '4px' }}>
                {JSON.stringify(testResults.basicConnection, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Alternative Server Test */}
        {testResults.altConnection && (
          <div style={{ 
            margin: '10px 0', 
            padding: '15px', 
            background: testResults.altConnection?.success ? '#065f46' : '#7f1d1d',
            borderRadius: '8px',
            border: `2px solid ${testResults.altConnection?.success ? '#10b981' : '#ef4444'}`
          }}>
            <strong>2. Alternative Server ({ALT_PORT}):</strong> {
              testResults.altConnection?.success ? '✅ CONNECTED' : '❌ FAILED'
            }
            <div style={{ marginTop: '8px' }}>
              <div style={{ fontSize: '12px', color: '#d1d5db' }}>
                URL: {testResults.altConnection.url}
              </div>
              <pre style={{ fontSize: '11px', marginTop: '5px', background: '#000', padding: '8px', borderRadius: '4px' }}>
                {JSON.stringify(testResults.altConnection, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* API Test */}
        <div style={{ 
          margin: '10px 0', 
          padding: '15px', 
          background: testResults.apiTest?.success ? '#065f46' : '#7f1d1d',
          borderRadius: '8px',
          border: `2px solid ${testResults.apiTest?.success ? '#10b981' : '#ef4444'}`
        }}>
          <strong>3. API Endpoints:</strong> {
            testResults.apiTest?.success ? '✅ WORKING' : '❌ FAILED'
          }
          {testResults.apiTest && (
            <div style={{ marginTop: '8px' }}>
              <div style={{ fontSize: '12px', color: '#d1d5db' }}>
                URL: {testResults.apiTest.url}
              </div>
              <pre style={{ fontSize: '11px', marginTop: '5px', background: '#000', padding: '8px', borderRadius: '4px' }}>
                {JSON.stringify(testResults.apiTest, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* POST Test */}
        <div style={{ 
          margin: '10px 0', 
          padding: '15px', 
          background: testResults.postTest?.success ? '#065f46' : '#7f1d1d',
          borderRadius: '8px',
          border: `2px solid ${testResults.postTest?.success ? '#10b981' : '#ef4444'}`
        }}>
          <strong>4. POST Requests:</strong> {
            testResults.postTest?.success ? '✅ WORKING' : '❌ FAILED'
          }
          {testResults.postTest && (
            <div style={{ marginTop: '8px' }}>
              <div style={{ fontSize: '12px', color: '#d1d5db' }}>
                URL: {testResults.postTest.url}
              </div>
              <pre style={{ fontSize: '11px', marginTop: '5px', background: '#000', padding: '8px', borderRadius: '4px' }}>
                {JSON.stringify(testResults.postTest, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Network Info */}
        {testResults.networkInfo && (
          <div style={{ 
            margin: '10px 0', 
            padding: '15px', 
            background: '#1f2937',
            borderRadius: '8px',
            border: '2px solid #374151'
          }}>
            <strong>5. Device Information:</strong>
            <pre style={{ fontSize: '11px', marginTop: '5px', background: '#000', padding: '8px', borderRadius: '4px' }}>
              {JSON.stringify(testResults.networkInfo, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div style={{ marginTop: '30px', fontSize: '14px', color: '#9ca3af', background: '#1f2937', padding: '15px', borderRadius: '8px' }}>
        <h4 style={{ color: '#f59e0b', marginBottom: '10px' }}>🔧 Troubleshooting Guide:</h4>
        <div style={{ marginBottom: '10px' }}>
          <strong>If ALL tests fail:</strong>
          <ul style={{ marginLeft: '20px', marginTop: '5px' }}>
            <li>Check if computer and phone are on same WiFi network</li>
            <li>Run FIREWALL_FIX.bat on computer as administrator</li>
            <li>Verify server is running: npm start</li>
            <li>Try mobile hotspot instead of WiFi</li>
          </ul>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <strong>If Primary fails but Alternative works:</strong>
          <ul style={{ marginLeft: '20px', marginTop: '5px' }}>
            <li>Port 3001 is blocked, use port 8080</li>
            <li>Update mobile app configuration</li>
          </ul>
        </div>
        <div>
          <strong>Quick Test:</strong>
          <div style={{ background: '#000', padding: '8px', borderRadius: '4px', marginTop: '5px', fontFamily: 'monospace' }}>
            Open phone browser → http://10.14.28.123:3001/api/health
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionTest;