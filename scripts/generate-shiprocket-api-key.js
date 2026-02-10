/**
 * Verify Shiprocket API Key
 * Run: node scripts/generate-shiprocket-api-key.js
 */

require('dotenv').config();
const axios = require('axios');

const SHIPROCKET_API_BASE = 'https://apiv2.shiprocket.in/v1/external';
const SHIPROCKET_API_KEY = process.env.SHIPROCKET_API_KEY;

if (!SHIPROCKET_API_KEY) {
  console.error('❌ Error: SHIPROCKET_API_KEY not set in .env');
  process.exit(1);
}

async function verifyApiKey() {
  try {
    console.log('🔐 Verifying Shiprocket API Key...\n');
    console.log(`API Key: ${SHIPROCKET_API_KEY.substring(0, 50)}...\n`);

    // Verify the API key by making a test request
    const response = await axios.get(
      `${SHIPROCKET_API_BASE}/settings/company/pickup`,
      {
        headers: {
          Authorization: `Bearer ${SHIPROCKET_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✓ API Key is VALID!\n');
    console.log('📋 Account Information:\n');
    
    if (response.data.data && response.data.data.length > 0) {
      console.log(`✓ Found ${response.data.data.length} pickup location(s):\n`);
      response.data.data.forEach((location, idx) => {
        console.log(`  Location ${idx + 1}:`);
        console.log(`    ID: ${location.id}`);
        console.log(`    Name: ${location.name}`);
        console.log(`    Pincode: ${location.pincode}`);
        console.log(`    City: ${location.city}`);
        console.log('');
      });
    } else {
      console.log('⚠️  No pickup locations configured');
      console.log('   Please add a pickup location in Shiprocket dashboard\n');
    }

    console.log('='.repeat(80));
    console.log('\n✓ Your Shiprocket account is ready!\n');
    console.log('📝 Current Configuration:\n');
    console.log(`  API Key: ${SHIPROCKET_API_KEY.substring(0, 30)}...`);
    console.log(`  Mock Mode: ${process.env.SHIPROCKET_MOCK_MODE || 'false'}`);
    console.log(`  Store Pincode: ${process.env.NEXT_PUBLIC_STORE_PINCODE || '121006'}`);
    console.log('\n' + '='.repeat(80) + '\n');

    return true;
  } catch (error) {
    console.error('❌ API Key verification failed:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message || error.message);
    console.error('\n⚠️  Your API key may be invalid or expired');
    console.error('   Please check your Shiprocket account\n');
    process.exit(1);
  }
}

verifyApiKey();
