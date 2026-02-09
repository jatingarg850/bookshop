const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

async function test(email, password) {
  try {
    console.log('\n-- Testing auth for', email);
    const authRes = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', { email, password }, { headers: { 'Content-Type': 'application/json' }, timeout: 15000 });
    console.log('Auth success, token length:', (authRes.data && authRes.data.token) ? authRes.data.token.length : 'no-token');

    const token = authRes.data.token;
    const client = axios.create({ baseURL: 'https://apiv2.shiprocket.in/v1/external', headers: { Authorization: `Bearer ${token}` }, timeout: 15000 });

    // Test rates using common pincodes
    const params = { pickup_postcode: process.env.SHIPROCKET_PICKUP_POSTCODE || '110001', delivery_postcode: process.env.TEST_DELIVERY_PINCODE || '560001', weight: 1.0, cod: 0 };
    console.log('Requesting shipping rates with params:', params);
    const ratesRes = await client.get('/courier/courierListWithRate', { params });
    console.log('Rates response status:', ratesRes.status);
    console.log('Rates body preview:', JSON.stringify(ratesRes.data).slice(0, 1000));
    return { auth: authRes.data, rates: ratesRes.data };
  } catch (err) {
    if (err.response) {
      console.error('HTTP error:', err.response.status, err.response.data);
    } else {
      console.error('Error:', err.message);
    }
    return { error: err.response ? err.response.data : err.message };
  }
}

(async () => {
  const email1 = process.env.SHIPROCKET_EMAIL;
  const pass1 = process.env.SHIPROCKET_PASSWORD;
  const res1 = await test(email1, pass1);
  console.log('\nResult for', email1, ':', res1.error ? 'ERROR' : 'OK');

  // If first fails, try fallback (MYSTATIONERYHUB1)
  if (res1.error) {
    const fallbackEmail = process.env.SHIPROCKET_FALLBACK_EMAIL || 'MYSTATIONERYHUB1@GMAIL.COM';
    const fallbackPass = process.env.SHIPROCKET_FALLBACK_PASSWORD || 'Amahub@111';
    console.log('\nTrying fallback API credentials:', fallbackEmail);
    const res2 = await test(fallbackEmail, fallbackPass);
    console.log('\nResult for', fallbackEmail, ':', res2.error ? 'ERROR' : 'OK');
  }
})();
