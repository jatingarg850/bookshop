/**
 * Setup Pickup Location for Shiprocket
 * This script helps you add a pickup location via API
 * Run: node scripts/setup-pickup-location.js
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

async function getPickupLocations() {
  try {
    console.log('\n📍 Fetching existing pickup locations...\n');
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
        console.log(`    Phone: ${location.phone}`);
        console.log('');
      });
      return response.data.data;
    } else {
      console.log('❌ No pickup locations found!\n');
      return [];
    }
  } catch (error) {
    console.error('❌ Error fetching pickup locations:', error.response?.data?.message || error.message);
    return [];
  }
}

async function createPickupLocation() {
  try {
    console.log('\n📝 Creating new pickup location...\n');
    
    // Default location data - you can modify this
    const pickupData = {
      pickup_location_name: 'Radhe Stationery',
      name: 'Radhe Stationery',
      email: 'mystationeryhub1@gmail.com',
      phone: '9999999999',
      address: 'Faridabad, Haryana',
      address_type: 'office',
      city: 'Faridabad',
      state: 'Haryana',
      country: 'India',
      pincode: '121006',
      latitude: '28.4089',
      longitude: '77.3178',
    };

    console.log('Sending pickup location data:');
    console.log(JSON.stringify(pickupData, null, 2));
    console.log('');

    const response = await client.post('/settings/company/pickup', pickupData);
    
    if (response.data.success || response.data.data) {
      console.log('✓ Pickup location created successfully!\n');
      console.log('Response:', JSON.stringify(response.data, null, 2));
      
      if (response.data.data && response.data.data.id) {
        console.log(`\n📌 Pickup Location ID: ${response.data.data.id}`);
        console.log('\nUpdate your .env file with:');
        console.log(`SHIPROCKET_PICKUP_LOCATION_ID=${response.data.data.id}`);
      }
      return response.data.data;
    } else {
      console.log('⚠️  Response:', JSON.stringify(response.data, null, 2));
      return null;
    }
  } catch (error) {
    console.error('❌ Error creating pickup location:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message || error.message);
    console.error('Data:', error.response?.data);
    return null;
  }
}

async function main() {
  console.log('='.repeat(80));
  console.log('🔧 SHIPROCKET PICKUP LOCATION SETUP');
  console.log('='.repeat(80));

  // First, check existing locations
  const existingLocations = await getPickupLocations();

  if (existingLocations.length > 0) {
    console.log('✅ You already have pickup location(s) configured!');
    console.log('\n📌 Use this ID in your .env:');
    console.log(`SHIPROCKET_PICKUP_LOCATION_ID=${existingLocations[0].id}`);
    console.log('\nUpdate .env and restart your server.');
  } else {
    console.log('Creating new pickup location...');
    const newLocation = await createPickupLocation();
    
    if (newLocation) {
      console.log('\n✅ Setup complete!');
      console.log('Update your .env file and restart the server.');
    } else {
      console.log('\n❌ Failed to create pickup location.');
      console.log('Please create it manually in Shiprocket dashboard:');
      console.log('https://app.shiprocket.in/settings/pickup-locations');
    }
  }

  console.log('\n' + '='.repeat(80) + '\n');
}

main().catch(error => {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});
