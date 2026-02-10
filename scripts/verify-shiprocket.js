/**
 * Quick Shiprocket API Key Verification
 * Run: node scripts/verify-shiprocket.js
 */

require('dotenv').config();

const SHIPROCKET_API_KEY = process.env.SHIPROCKET_API_KEY;
const SHIPROCKET_MOCK_MODE = process.env.SHIPROCKET_MOCK_MODE;
const STORE_PINCODE = process.env.NEXT_PUBLIC_STORE_PINCODE;

console.log('🔍 Shiprocket Configuration Check\n');
console.log('='.repeat(80));

if (!SHIPROCKET_API_KEY) {
  console.log('❌ SHIPROCKET_API_KEY: NOT SET');
} else {
  console.log('✓ SHIPROCKET_API_KEY: SET');
  console.log(`  Value: ${SHIPROCKET_API_KEY.substring(0, 50)}...`);
}

console.log(`\n${SHIPROCKET_MOCK_MODE === 'true' ? '✓' : '⚠️'} SHIPROCKET_MOCK_MODE: ${SHIPROCKET_MOCK_MODE || 'false'}`);

console.log(`\n✓ NEXT_PUBLIC_STORE_PINCODE: ${STORE_PINCODE || '121006'}`);

console.log('\n' + '='.repeat(80));

if (SHIPROCKET_API_KEY && SHIPROCKET_MOCK_MODE !== 'true') {
  console.log('\n✅ Configuration looks good!');
  console.log('   - API Key is set');
  console.log('   - Mock mode is disabled');
  console.log('   - Ready to use real Shiprocket\n');
} else if (SHIPROCKET_MOCK_MODE === 'true') {
  console.log('\n✅ Mock mode is enabled');
  console.log('   - Using mock shipping rates');
  console.log('   - No real Shiprocket calls\n');
} else {
  console.log('\n⚠️  Configuration incomplete');
  console.log('   - Please set SHIPROCKET_API_KEY in .env\n');
}

console.log('='.repeat(80) + '\n');
