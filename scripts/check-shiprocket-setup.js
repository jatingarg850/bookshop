/**
 * Check Shiprocket Account Setup Status
 * Run: node scripts/check-shiprocket-setup.js
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
});

async function checkPickupLocations() {
  try {
    console.log('\n📍 Checking Pickup Locations...');
    const response = await client.get('/settings/company/pickup');
    
    if (response.data.data && response.data.data.length > 0) {
      console.log(`✓ Found ${response.data.data.length} pickup location(s):\n`);
      response.data.data.forEach((location, idx) => {
        console.log(`  Location ${idx + 1}:`);
        console.log(`    ID: ${location.id}`);
        console.log(`    Name: ${location.name}`);
        console.log(`    Pincode: ${location.pincode}`);
        console.log(`    City: ${location.city}`);
        console.log(`    State: ${location.state}`);
        console.log(`    Address: ${location.address}`);
        console.log('');
      });
      return response.data.data;
    } else {
      console.log('❌ No pickup locations found!');
      console.log('   Action: Add a pickup location in Shiprocket dashboard');
      return [];
    }
  } catch (error) {
    console.error('❌ Error checking pickup locations:', error.response?.data?.message || error.message);
    return [];
  }
}

async function checkCourierPartners() {
  try {
    console.log('\n🚚 Checking Courier Partners...');
    const response = await client.get('/settings/company/courierpartner');
    
    if (response.data.data && response.data.data.length > 0) {
      console.log(`✓ Found ${response.data.data.length} courier partner(s):\n`);
      response.data.data.forEach((courier, idx) => {
        console.log(`  Courier ${idx + 1}:`);
        console.log(`    ID: ${courier.courier_id}`);
        console.log(`    Name: ${courier.courier_name}`);
        console.log(`    Status: ${courier.is_active ? 'Active' : 'Inactive'}`);
        console.log('');
      });
      return response.data.data;
    } else {
      console.log('❌ No courier partners activated!');
      console.log('   Action: Activate courier partners in Shiprocket dashboard');
      return [];
    }
  } catch (error) {
    console.error('❌ Error checking courier partners:', error.response?.data?.message || error.message);
    return [];
  }
}

async function checkServiceability(pickupPincode) {
  try {
    console.log(`\n🔍 Testing Serviceability from Pincode ${pickupPincode}...\n`);
    
    // Test with a few common pincodes
    const testPincodes = ['110001', '201301', '121006', '122001'];
    
    for (const pincode of testPincodes) {
      try {
        const response = await client.get('/courier/courierListWithRate', {
          params: {
            pickup_postcode: pickupPincode,
            delivery_postcode: pincode,
            weight: 0.5,
            cod: 0,
          },
        });
        
        if (response.data.rates && response.data.rates.length > 0) {
          console.log(`  ✓ ${pincode}: Serviceable (${response.data.rates.length} couriers)`);
        } else {
          console.log(`  ✗ ${pincode}: Not serviceable`);
        }
      } catch (error) {
        console.log(`  ✗ ${pincode}: Error - ${error.response?.status || error.message}`);
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  } catch (error) {
    console.error('❌ Error testing serviceability:', error.message);
  }
}

async function main() {
  console.log('='.repeat(80));
  console.log('🔧 SHIPROCKET ACCOUNT SETUP CHECK');
  console.log('='.repeat(80));
  
  console.log('\n📋 Account Information:');
  console.log(`API Key: ${SHIPROCKET_API_KEY.substring(0, 30)}...`);
  console.log(`Store Pincode: ${process.env.NEXT_PUBLIC_STORE_PINCODE || '121006'}`);
  
  // Check pickup locations
  const pickupLocations = await checkPickupLocations();
  
  // Check courier partners
  const couriers = await checkCourierPartners();
  
  // Test serviceability
  if (pickupLocations.length > 0) {
    await checkServiceability(pickupLocations[0].pincode);
  }
  
  // Summary and recommendations
  console.log('\n' + '='.repeat(80));
  console.log('📊 SETUP STATUS SUMMARY\n');
  
  const pickupOk = pickupLocations.length > 0;
  const courierOk = couriers.length > 0;
  
  console.log(`Pickup Locations: ${pickupOk ? '✓ Configured' : '❌ Not configured'}`);
  console.log(`Courier Partners: ${courierOk ? '✓ Activated' : '❌ Not activated'}`);
  
  if (!pickupOk || !courierOk) {
    console.log('\n⚠️  SETUP INCOMPLETE - REQUIRED ACTIONS:\n');
    
    if (!pickupOk) {
      console.log('1. Add Pickup Location:');
      console.log('   - Go to Shiprocket Dashboard');
      console.log('   - Settings → Pickup Locations');
      console.log('   - Add your warehouse/store location');
      console.log('   - Note the pincode\n');
    }
    
    if (!courierOk) {
      console.log('2. Activate Courier Partners:');
      console.log('   - Go to Shiprocket Dashboard');
      console.log('   - Settings → Courier Partners');
      console.log('   - Activate at least one courier (e.g., Delhivery, Ecom Express)');
      console.log('   - Configure service areas\n');
    }
    
    console.log('3. After Setup:');
    console.log('   - Run: node scripts/test-serviceable-pincodes.js');
    console.log('   - This will show which pincodes are serviceable\n');
  } else {
    console.log('\n✅ SETUP COMPLETE - Ready to process orders!');
  }
  
  console.log('='.repeat(80) + '\n');
}

main().catch(error => {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});
