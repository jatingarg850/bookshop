/**
 * Verify Shiprocket is Ready for Orders
 * Run: node scripts/verify-shiprocket-ready.js
 */

require('dotenv').config();
const axios = require('axios');

const SHIPROCKET_API_BASE = 'https://apiv2.shiprocket.in/v1/external';
const SHIPROCKET_API_KEY = process.env.SHIPROCKET_API_KEY;
const SHIPROCKET_PICKUP_LOCATION_ID = process.env.SHIPROCKET_PICKUP_LOCATION_ID;
const STORE_PINCODE = process.env.NEXT_PUBLIC_STORE_PINCODE || '121006';

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

async function getPickupLocations() {
  try {
    console.log('\n📍 Checking Pickup Locations...');
    const response = await client.get('/settings/company/pickup');
    
    // Handle the actual response format from Shiprocket
    let locations = [];
    if (response.data.data && response.data.data.shipping_address) {
      locations = response.data.data.shipping_address;
    } else if (response.data.data && Array.isArray(response.data.data)) {
      locations = response.data.data;
    }
    
    if (locations && locations.length > 0) {
      console.log(`✓ Found ${locations.length} pickup location(s):\n`);
      locations.forEach((location, idx) => {
        console.log(`  Location ${idx + 1}:`);
        console.log(`    ID: ${location.id}`);
        console.log(`    Name: ${location.pickup_location || location.name}`);
        console.log(`    Address: ${location.address}`);
        console.log('');
      });
      return locations;
    } else {
      console.log('❌ No pickup locations found!');
      return [];
    }
  } catch (error) {
    console.error('❌ Error checking pickup locations:', error.response?.data?.message || error.message);
    return [];
  }
}

async function testShippingRates() {
  try {
    console.log('\n📦 Testing Shipping Rates...');
    console.log(`From: ${STORE_PINCODE}`);
    console.log(`To: 110001 (Delhi - test pincode)`);
    
    const response = await client.get('/courier/courierListWithRate', {
      params: {
        pickup_postcode: STORE_PINCODE,
        delivery_postcode: '110001',
        weight: 0.5,
        cod: 0,
      },
    });
    
    if (response.data.rates && response.data.rates.length > 0) {
      console.log(`✓ Found ${response.data.rates.length} available couriers:\n`);
      response.data.rates.slice(0, 3).forEach((rate, idx) => {
        console.log(`  Courier ${idx + 1}:`);
        console.log(`    Name: ${rate.courier_name}`);
        console.log(`    Rate: ₹${rate.rate}`);
        console.log(`    ETD: ${rate.etd} days`);
        console.log('');
      });
      return true;
    } else {
      console.log('❌ No couriers available for this route');
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing shipping rates:', error.response?.data?.message || error.message);
    return false;
  }
}

async function main() {
  console.log('='.repeat(80));
  console.log('✅ SHIPROCKET READINESS CHECK');
  console.log('='.repeat(80));

  console.log('\n📋 Configuration:');
  console.log(`API Key: ${SHIPROCKET_API_KEY.substring(0, 30)}...`);
  console.log(`Pickup Location ID: ${SHIPROCKET_PICKUP_LOCATION_ID}`);
  console.log(`Store Pincode: ${STORE_PINCODE}`);

  // Check pickup locations
  const locations = await getPickupLocations();
  const pickupOk = locations.length > 0;

  // Test shipping rates
  const ratesOk = await testShippingRates();

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 READINESS STATUS\n');

  console.log(`Pickup Locations: ${pickupOk ? '✅ OK' : '❌ FAILED'}`);
  console.log(`Shipping Rates: ${ratesOk ? '✅ OK' : '❌ FAILED'}`);

  if (pickupOk && ratesOk) {
    console.log('\n🎉 SYSTEM IS READY FOR ORDERS!');
    console.log('\nYou can now:');
    console.log('1. Go to checkout');
    console.log('2. Add a product');
    console.log('3. Enter pincode: 110001 (or any serviceable pincode)');
    console.log('4. Select COD or Razorpay');
    console.log('5. Place order');
    console.log('6. Order will be automatically shipped with AWB code');
  } else {
    console.log('\n⚠️  SYSTEM NOT READY');
    if (!pickupOk) {
      console.log('- Pickup location not configured');
    }
    if (!ratesOk) {
      console.log('- Shipping rates not available');
    }
  }

  console.log('\n' + '='.repeat(80) + '\n');
}

main().catch(error => {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});
