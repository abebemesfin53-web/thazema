const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testLogin() {
  try {
    console.log('🔐 Testing Thazema Login...\n');

    // Test 1: Health check
    console.log('1. Testing server health...');
    const healthResponse = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Server is running:', healthResponse.data.message);

    // Test 2: Direct test route
    console.log('\n2. Testing direct route...');
    const directResponse = await axios.post(`${BASE_URL}/api/test-login`, {
      email: 'test@example.com',
      password: 'test123'
    });
    console.log('✅ Direct route working!');
    console.log('📋 Response:', directResponse.data.message);

    // Test 3: Admin login
    console.log('\n3. Testing admin login...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'abebemesfin53@gmail.com',
      password: 'admin123'
    });
    console.log('✅ Admin login successful!');
    console.log('👤 User:', loginResponse.data.user.username);
    console.log('🔑 Token received:', loginResponse.data.token ? 'Yes' : 'No');

    console.log('\n🎉 LOGIN IS WORKING!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      console.log('\n🔍 Route not found. Let me check what routes are available...');
    }
  }
}

testLogin();