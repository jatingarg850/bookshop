/**
 * Get Shiprocket Account Information
 * Run: node scripts/get-shiprocket-account-info.js
 */

require('dotenv').config();
const axios = require('axios');

const SHIPROCKET_API_BASE = 'https://apiv2.shiprocket.in/v1/external';
const SHIPROCKET_API_KEY = process.env.SHIPROCKET_API_KEY;

if (!SHIPROCKET_API_KEY) {
  console.error('❌ Error: SHIPROCKET_API_KEY not set in .env');
  process.exit(1);
}

const client = axios.create({
  baseURL: SHIPROCKET_API_BASE,
  headers: {
    'Authorization': `Bearer ${SHIPROCKET_API_KEY}`,
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

async function testEndpoints() {
  const endpoints = [
    { name: 'Pickup Locations', url: '/settings/company/pickup' },
    { name: 'Company Info', url: '/settings/company' },
    { name: 'Courier Partners', url: '/settings/company/courierpartner' },
    { name: 'Account', url: '/account' },
  ];

  console.log('\n🔍 Testing Shiprocket API Endpoints...\n');

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing: ${endpoint.name}`);
      console.log(`URL: ${endpoint.url}`);
      
      const response = await client.get(endpoint.url);
      
      console.log(`✓ Status: ${response.status}`);
      console.log(`✓ Response:`, JSON.stringify(response.data, null, 2).substring(0, 200));
      console.log('');
    } catch (error) {
      console.log(`✗ Error: ${error.response?.status || error.message}`);
      if (error.response?.data) {
        console.log(`  Data:`, JSON.stringify(error.response.data).substring(0, 200));
      }
      console.log('');
    }

    // Small delay
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('🔧 SHIPROCKET API DIAGNOSTICS');
  console.log('='.repeat(60));

  console.log('\nAPI Key:', SHIPROCKET_API_KEY.substring(0, 30) + '...');
  console.log('API Base:', SHIPROCKET_API_BASE);

  await testEndpoints();

  console.log('='.repeat(60));
  console.log('\n💡 NEXT STEPS:');
  console.log('1. If pickup locations endpoint fails, the API key may not have permission');
  console.log('2. Check Shiprocket dashboard for account status');
  console.log('3. Try regenerating API key if needed');
  console.log('4. Contact Shiprocket support if issue persists\n');
}

main().catch(error => {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});
