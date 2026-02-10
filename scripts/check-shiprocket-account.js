/**
 * Check Shiprocket Account Status
 * Run: node scripts/check-shiprocket-account.js
 */

require('dotenv').config();
const axios = require('axios');

const SHIPROCKET_API_BASE = 'https://apiv2.shiprocket.in/v1/external';
const SHIPROCKET_API_KEY = process.env.SHIPROCKET_API_KEY;

if (!SHIPROCKET_API_KEY) {
  console.error('❌ Error: SHIPROCKET_API_KEY not set in .env');
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${SHIPROCKET_API_KEY}`,
  'Content-Type': 'application/json',
};

async function checkAccount() {
  try {
    console.log('🔍 Checking Shiprocket Account Status\n');

    // Check company info
    console.log('1️⃣  Fetching Company Information...');
    try {
      const companyRes = await axios.get(`${SHIPROCKET_API_BASE}/settings/company`, {
        headers,
      });
      console.log('✓ Company:', companyRes.data.company_name);
      console.log('  Email:', companyRes.data.email);
      console.log('  Phone:', companyRes.data.phone);
    } catch (error) {
      console.log('⚠️  Could not fetch company info:', error.response?.data?.message);
    }

    // Check pickup locations
    console.log('\n2️⃣  Fetching Pickup Locations...');
    try {
      const pickupRes = await axios.get(`${SHIPROCKET_API_BASE}/settings/company/pickup`, {
        headers,
      });
      
      if (pickupRes.data.data && pickupRes.data.data.length > 0) {
        console.log(`✓ Found ${pickupRes.data.data.length} pickup location(s):\n`);
        pickupRes.data.data.forEach((location, idx) => {
          console.log(`  Location ${idx + 1}:`);
          console.log(`    ID: ${location.id}`);
          console.log(`    Name: ${location.name}`);
          console.log(`    Address: ${location.address}`);
          console.log(`    City: ${location.city}`);
          console.log(`    State: ${location.state}`);
          console.log(`    Pincode: ${location.pincode}`);
          console.log(`    Country: ${location.country}`);
          console.log('');
        });
      } else {
        console.log('❌ No pickup locations configured!');
        console.log('   You must add a pickup location in Shiprocket dashboard');
      }
    } catch (error) {
      console.log('❌ Error fetching pickup locations:', error.response?.data?.message);
    }

    // Check account balance
    console.log('3️⃣  Checking Account Balance...');
    try {
      const balanceRes = await axios.get(`${SHIPROCKET_API_BASE}/account/balance`, {
        headers,
      });
      console.log('✓ Account Balance:', balanceRes.data);
    } catch (error) {
      console.log('⚠️  Could not fetch balance:', error.response?.data?.message);
    }

    // Check courier partners
    console.log('\n4️⃣  Checking Courier Partners...');
    try {
      const couriersRes = await axios.get(`${SHIPROCKET_API_BASE}/courier/courierPartners`, {
        headers,
      });
      
      if (couriersRes.data.data && couriersRes.data.data.length > 0) {
        console.log(`✓ Found ${couriersRes.data.data.length} courier partner(s):\n`);
        couriersRes.data.data.forEach((courier, idx) => {
          console.log(`  ${idx + 1}. ${courier.courier_name} (ID: ${courier.courier_id})`);
        });
      } else {
        console.log('❌ No courier partners activated!');
      }
    } catch (error) {
      console.log('⚠️  Could not fetch courier partners:', error.response?.data?.message);
    }

    console.log('\n' + '='.repeat(80));
    console.log('\n🔧 TROUBLESHOOTING:\n');
    console.log('If no pickup locations are shown:');
    console.log('1. Log into https://app.shiprocket.in');
    console.log('2. Go to Settings → Pickup Locations');
    console.log('3. Add your warehouse/store location');
    console.log('4. Make sure to activate courier partners');
    console.log('\nIf no courier partners are shown:');
    console.log('1. Go to Settings → Courier Partners');
    console.log('2. Activate at least one courier (e.g., Delhivery, Ecom Express)');
    console.log('\n' + '='.repeat(80) + '\n');

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

checkAccount();
