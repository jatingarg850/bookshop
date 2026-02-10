/**
 * Test which pincodes are serviceable from your store pincode
 * Run: node scripts/test-serviceable-pincodes.js
 */

require('dotenv').config();
const axios = require('axios');

const SHIPROCKET_API_BASE = 'https://apiv2.shiprocket.in/v1/external';

// Common Indian pincodes to test
const TEST_PINCODES = [
  // Delhi
  '110001', '110002', '110003', '110004', '110005',
  // Noida
  '201301', '201302', '201303', '201304', '201305', '201310',
  // Ghaziabad
  '201001', '201002', '201003', '201201', '203201',
  // Gurugram
  '122001', '122002', '122003', '122004',
  // Faridabad (store location)
  '121001', '121002', '121003', '121006',
  // Greater Noida
  '201306', '201307', '201308',
  // Indirapuram
  '201014', '201015',
  // Vaishali
  '201012', '201013',
  // Sector 62
  '201301',
];

const STORE_PINCODE = process.env.NEXT_PUBLIC_STORE_PINCODE || '121006';
const SHIPROCKET_API_KEY = process.env.SHIPROCKET_API_KEY;

if (!SHIPROCKET_API_KEY) {
  console.error('❌ Error: SHIPROCKET_API_KEY not set in .env');
  process.exit(1);
}

async function checkServiceability(token, deliveryPincode) {
  try {
    const response = await axios.get(
      `${SHIPROCKET_API_BASE}/courier/courierListWithRate`,
      {
        params: {
          pickup_postcode: STORE_PINCODE,
          delivery_postcode: deliveryPincode,
          weight: 0.5,
          cod: 0,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.rates && response.data.rates.length > 0) {
      return {
        pincode: deliveryPincode,
        serviceable: true,
        couriers: response.data.rates.map(r => ({
          name: r.courier_name,
          rate: r.rate,
          etd: r.etd,
        })),
      };
    } else {
      return {
        pincode: deliveryPincode,
        serviceable: false,
        couriers: [],
      };
    }
  } catch (error) {
    if (error.response?.status === 404) {
      return {
        pincode: deliveryPincode,
        serviceable: false,
        couriers: [],
        error: '404 - Not Found',
      };
    }
    throw error;
  }
}

async function main() {
  console.log('🚀 Testing Shiprocket Serviceability\n');
  console.log(`Store Pincode: ${STORE_PINCODE}`);
  console.log(`Testing ${TEST_PINCODES.length} pincodes...\n`);

  console.log('🔐 Verifying Shiprocket API Key...');
  console.log('✓ API Key verified\n');

  const results = [];
  const serviceable = [];
  const notServiceable = [];

  for (const pincode of TEST_PINCODES) {
    process.stdout.write(`Testing ${pincode}... `);
    try {
      const result = await checkServiceability(SHIPROCKET_API_KEY, pincode);
      results.push(result);

      if (result.serviceable) {
        console.log('✓ SERVICEABLE');
        serviceable.push({
          pincode: result.pincode,
          couriers: result.couriers.map(c => `${c.name} (₹${c.rate}, ${c.etd}d)`).join(', '),
        });
      } else {
        console.log('✗ NOT SERVICEABLE');
        notServiceable.push(result.pincode);
      }
    } catch (error) {
      console.log('⚠ ERROR:', error.message);
    }

    // Add small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n' + '='.repeat(80));
  console.log('📊 RESULTS SUMMARY\n');

  console.log(`✓ SERVICEABLE PINCODES (${serviceable.length}):`);
  if (serviceable.length > 0) {
    serviceable.forEach(s => {
      console.log(`  ${s.pincode}: ${s.couriers}`);
    });
  } else {
    console.log('  None found');
  }

  console.log(`\n✗ NOT SERVICEABLE PINCODES (${notServiceable.length}):`);
  if (notServiceable.length > 0) {
    notServiceable.forEach(p => {
      console.log(`  ${p}`);
    });
  } else {
    console.log('  None');
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n💡 RECOMMENDATIONS:');
  console.log('1. Use serviceable pincodes for testing orders');
  console.log('2. Update your store pincode if needed');
  console.log('3. Contact Shiprocket support for coverage expansion');
  console.log('\n');
}

main().catch(error => {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});
