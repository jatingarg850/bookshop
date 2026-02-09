# Shiprocket Shipping Rate Debugging Guide

## Changes Made

### 1. Enhanced Logging in Shipping Rates API
**File:** `/app/api/shiprocket/shipping-rates/route.ts`
- Added detailed request validation logging with specific field checks
- Logs all request parameters (pickup_postcode, delivery_postcode, weight, cod, etc.)
- Enhanced error responses with Shiprocket API details
- Logs when rates are empty or unavailable

### 2. Improved Admin Order Page
**File:** `/app/admin/orders/[id]/page.tsx`
- Added `rateError` state to capture and display error messages
- Added detailed logging in `fetchShippingRates()` function
- Enhanced `calculateWeight()` with item-level weight details
- Improved UI with error messages, helpful debug info, and loading states
- Added validation for weight and pincode format

### 3. Enhanced Shiprocket Client Logging
**File:** `/lib/utils/shiprocket.ts`
- Added detailed logs for authentication
- Added request/response logging for shipping rates
- Better error messages with status codes and response data

---

## How to Debug Shipping Rate Issues

### Step 1: Check Server Logs
When you click "Ship Order", monitor the terminal running the Next.js server:

**Expected successful flow:**
```
🔐 Authenticating with Shiprocket...
✅ Shiprocket authentication successful
📦 Fetching shipping rates with params: { pickup_postcode: '110001', delivery_postcode: '560001', weight: 2.5, cod: 0 }
✅ Shipping rates response: { rates: [...] }
```

**Common error patterns:**
```
❌ Shiprocket authentication failed: Invalid credentials
❌ Failed to get shipping rates: Service unavailable for this route
⚠️ No shipping rates available for this route
```

### Step 2: Check Browser Console (F12)
The UI will show detailed error messages in the admin order detail page:
- Pincode validation errors
- Weight calculation issues
- API connection errors
- Shiprocket-specific error messages

### Step 3: Verify Prerequisites

**Check .env.local has correct credentials:**
```bash
cat .env.local | grep SHIPROCKET
```

Should show:
```
SHIPROCKET_EMAIL=coddyiomsi22@gmail.com
SHIPROCKET_PASSWORD=5$qS!LWl2BJi6I7lbjPYf#CMmfgRY#Q7
SHIPROCKET_PICKUP_LOCATION_ID=1
```

**Verify pickup location exists:**
1. Log in to Shiprocket dashboard
2. Go to Settings → Pickup Locations
3. Confirm location ID 1 exists and is active
4. Note the pincode of this location

**Verify delivery pincode is valid:**
- Must be 6 digits
- Must be serviceable by Shiprocket
- Check order shipping address before clicking "Ship Order"

### Step 4: Test with Console Commands

**Test authentication:**
```bash
curl -X POST https://apiv2.shiprocket.in/v1/external/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"coddyiomsi22@gmail.com","password":"5$qS!LWl2BJi6I7lbjPYf#CMmfgRY#Q7"}'
```

**Test shipping rates (if authenticated):**
```bash
curl -X GET "https://apiv2.shiprocket.in/v1/external/courier/courierListWithRate?pickup_postcode=110001&delivery_postcode=560001&weight=2.5&cod=0" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Common Issues and Solutions

### Issue 1: "No shipping rates available"
**Causes:**
- Delivery pincode not serviceable by Shiprocket
- Pickup location doesn't exist or is inactive
- Weight is incorrect (0 or negative)

**Solution:**
1. Check delivery pincode is valid (6 digits)
2. Verify pickup location exists in Shiprocket dashboard
3. Check weight calculation in server logs (should be > 0)
4. Try with a more common delivery location (like 560001 for Bangalore)

### Issue 2: "Invalid credentials"
**Causes:**
- Shiprocket email/password incorrect in .env.local
- API user account suspended
- Password changed in Shiprocket

**Solution:**
1. Log in to Shiprocket dashboard manually to confirm credentials work
2. Check if account has API access enabled
3. Reset password if needed and update .env.local
4. Ensure credentials are for API user, not main account

### Issue 3: "Pickup location not found"
**Causes:**
- SHIPROCKET_PICKUP_LOCATION_ID doesn't exist
- Location was deleted or inactive

**Solution:**
1. Log in to Shiprocket → Settings → Pickup Locations
2. Note the correct location ID
3. Update SHIPROCKET_PICKUP_LOCATION_ID in .env.local
4. Restart Next.js server: `npm run dev`

### Issue 4: Empty rates array
**Causes:**
- Shiprocket doesn't service the route (pickup to delivery)
- Dimensions/weight combination not supported
- COD flag mismatch

**Solution:**
1. Test with different origin/destination pincodes
2. Check if dimensions are needed (currently optional)
3. Try with same COD flag as payment method
4. Contact Shiprocket support for route availability

---

## Testing Checklist

- [ ] .env.local has correct Shiprocket credentials
- [ ] Pickup location exists in Shiprocket and is active
- [ ] Order has valid 6-digit delivery pincode
- [ ] Order weight calculates correctly (> 0 kg)
- [ ] Server logs show successful authentication
- [ ] Shipping rates API responds with courier list
- [ ] Admin UI displays courier options instead of "No rates"
- [ ] Can select courier and ship order successfully

---

## Useful Shiprocket Resources

- **Dashboard:** https://app.shiprocket.in
- **API Docs:** https://apidocs.shiprocket.in
- **Support Email:** support@shiprocket.in
- **Integration Email:** integration@shiprocket.com

---

## Log Format Reference

### Request Logging
```
📊 Calculating shipping rates: {weight, pickup_postcode, delivery_postcode, payment_method}
📤 Requesting shipping rates with payload: {all params}
```

### Response Logging
```
✅ Received shipping rates: {rates array}
```

### Error Logging
```
❌ Error: {detailed error message}
⚠️ Warning: {caution message}
```

Color codes in terminal:
- 🔐 = Authentication
- 📦 = Shipping rates
- 📤 = Sending request
- 📊 = Calculating
- ✅ = Success
- ❌ = Error
- ⚠️ = Warning
