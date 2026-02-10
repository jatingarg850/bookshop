/**
 * Find serviceable pincodes by testing a wider range
 * Run: node scripts/find-serviceable-pincodes.js
 */

require('dotenv').config();
const axios = require('axios');

const SHIPROCKET_API_BASE = 'https://apiv2.shiprocket.in/v1/external';
const STORE_PINCODE = process.env.NEXT_PUBLIC_STORE_PINCODE || '121006';
const SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL;
const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD;

// Broader range of pincodes to test
const TEST_PINCODES = [
  // Major metros
  '400001', '400002', '400003', // Mumbai
  '560001', '560002', '560003', // Bangalore
  '600001', '600002', '600003', // Chennai
  '700001', '700002', '700003', // Kolkata
  '411001', '411002', '411003', // Pune
  '380001', '380002', '380003', // Ahmedabad
  '302001', '302002', '302003', // Jaipur
  '500001', '500002', '500003', // Hyderabad
  '452001', '452002', '452003', // Indore
  '360001', '360002', '360003', // Rajkot
  // Tier 2 cities
  '226001', '226002', '226003', // Lucknow
  '180001', '180002', '180003', // Shimla
  '171001', '171002', '171003', // Solan
  '160001', '160002', '160003', // Chandigarh
  '140001', '140002', '140003', // Ludhiana
  '130001', '130002', '130003', // Ambala
  '135001', '135002', '135003', // Yamunanagar
  '136001', '136002', '136003', // Hisar
  '131001', '131002', '131003', // Karnal
  '124001', '124002', '124003', // Rohtak
];

if (!SHIPROCKET_EMAIL || !SHIPROCKET_PASSWORD) {
  console.error('❌ Error: SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD not set in .env');
  process.exit(1);
}

async function authenticate() {
  try {
    const response = await axios.post(`${SHIPROCKET_API_BASE}/auth/login`, {
      email: SHIPROCKET_EMAIL,
      password: SHIPROCKET_PASSWORD,
    });
    return response.data.token;
  } catch (error) {
    console.error('❌ Authentication failed:', error.response?.data?.message || error.message);
    process.exit(1);
  }
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
    }
    return { pincode: deliveryPincode, serviceable: false };
  } catch (error) {
    return { pincode: deliveryPincode, serviceable: false };
  }
}

async function main() {
  console.log('🚀 Finding Serviceable Pincodes\n');
  console.log(`Store Pincode: ${STORE_PINCODE}`);
  console.log(`Testing ${TEST_PINCODES.length} pincodes...\n`);

  const token = await authenticate();
  console.log('✓ Authenticated\n');

  const serviceable = [];

  for (let i = 0; i < TEST_PINCODES.length; i++) {
    const pincode = TEST_PINCODES[i];
    process.stdout.write(`[${i + 1}/${TEST_PINCODES.length}] Testing ${pincode}... `);

    const result = await checkServiceability(token, pincode);

    if (result.serviceable) {
      console.log('✓ SERVICEABLE');
      serviceable.push({
        pincode: result.pincode,
        couriers: result.couriers.map(c => `${c.name} (₹${c.rate}, ${c.etd}d)`).join(', '),
      });
    } else {
      console.log('✗');
    }

    await new Promise(resolve => setTimeout(resolve, 50));
  }

  console.log('\n' + '='.repeat(80));
  console.log('📊 RESULTS\n');

  if (serviceable.length > 0) {
    console.log(`✓ FOUND ${serviceable.length} SERVICEABLE PINCODES:\n`);
    serviceable.forEach(s => {
      console.log(`  ${s.pincode}: ${s.couriers}`);
    });
  } else {
    console.log('❌ NO SERVICEABLE PINCODES FOUND');
    console.log('\n⚠️  This means your Shiprocket account has NO coverage.');
    console.log('\n🔧 SOLUTIONS:');
    console.log('1. Contact Shiprocket support: support@shiprocket.in');
    console.log('2. Verify your pickup location is correctly configured');
    console.log('3. Request coverage expansion for your region');
    console.log('4. Check if your account is properly activated');
  }

  console.log('\n' + '='.repeat(80) + '\n');
}

main().catch(error => {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});
