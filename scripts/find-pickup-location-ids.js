/**
 * Find Pickup Location IDs
 * Run: node scripts/find-pickup-location-ids.js
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

async function getPickupLocations() {
  try {
    console.log('\n🔍 Fetching pickup location IDs...\n');
    const response = await client.get('/settings/company/pickup');
    
    if (response.data.data && response.data.data.length > 0) {
      console.log(`✓ Found ${response.data.data.length} pickup location(s):\n`);
      
      response.data.data.forEach((location, idx) => {
        console.log(`Location ${idx + 1}:`);
        console.log(`  ID: ${location.id}`);
        console.log(`  Name: ${location.name}`);
        console.log(`  Pincode: ${location.pincode}`);
        console.log(`  City: ${location.city}`);
        console.log(`  State: ${location.state}`);
        console.log('');
      });

      // Find the Faridabad location (121006)
      const faridabadLocation = response.data.data.find(loc => 
        loc.pincode === '121006' || loc.city.toLowerCase().includes('faridabad')
      );

      if (faridabadLocation) {
        console.log('='.repeat(60));
        console.log('✅ RECOMMENDED PICKUP LOCATION:');
        console.log(`   ID: ${faridabadLocation.id}`);
        console.log(`   Name: ${faridabadLocation.name}`);
        console.log(`   Pincode: ${faridabadLocation.pincode}`);
        console.log('='.repeat(60));
        console.log('\nUpdate your .env file with:');
        console.log(`SHIPROCKET_PICKUP_LOCATION_ID=${faridabadLocation.id}`);
      } else {
        console.log('='.repeat(60));
        console.log('✅ PRIMARY PICKUP LOCATION:');
        console.log(`   ID: ${response.data.data[0].id}`);
        console.log(`   Name: ${response.data.data[0].name}`);
        console.log(`   Pincode: ${response.data.data[0].pincode}`);
        console.log('='.repeat(60));
        console.log('\nUpdate your .env file with:');
        console.log(`SHIPROCKET_PICKUP_LOCATION_ID=${response.data.data[0].id}`);
      }

      return response.data.data;
    } else {
      console.log('❌ No pickup locations found!');
      return [];
    }
  } catch (error) {
    console.error('❌ Error:', error.response?.data?.message || error.message);
    return [];
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('📍 SHIPROCKET PICKUP LOCATION ID FINDER');
  console.log('='.repeat(60));

  const locations = await getPickupLocations();

  if (locations.length > 0) {
    console.log('\n✅ Setup complete!');
    console.log('Restart your server after updating .env');
  }

  console.log('\n' + '='.repeat(60) + '\n');
}

main().catch(error => {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});
