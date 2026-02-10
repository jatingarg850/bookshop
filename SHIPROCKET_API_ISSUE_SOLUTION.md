# 🔧 Shiprocket API Issue - Solution

## The Problem

- ✅ Pickup locations visible in dashboard (4 locations)
- ✅ Couriers activated (142 available)
- ❌ API calls timing out
- ❌ API key not returning pickup location data

## Root Cause

The API key might be:
1. **Expired** (tokens expire after a period)
2. **Lacking permissions** for certain endpoints
3. **Account suspended** or needs reactivation
4. **Rate limited** or temporarily blocked

## Solution

### Option 1: Regenerate API Key (Recommended)

1. Go to: https://app.shiprocket.in/settings/api-keys
2. Delete the old API key
3. Generate a new API key
4. Copy the new key
5. Update `.env`:
   ```env
   SHIPROCKET_API_KEY=<new-key>
   ```
6. Restart server

### Option 2: Use Pickup Location ID from Dashboard

From your screenshot, I can see the **Primary** location. 

**Steps:**
1. Go to: https://app.shiprocket.in/settings/company-setup/pickup-addresses
2. Click "Edit" on the **Primary** location
3. Look at the URL - it will show the ID
4. Or look for an ID field in the edit form
5. Update `.env`:
   ```env
   SHIPROCKET_PICKUP_LOCATION_ID=<id-from-dashboard>
   ```

### Option 3: Use Default ID

Try these common IDs (usually the first location is ID 1 or 2):

```env
SHIPROCKET_PICKUP_LOCATION_ID=1
```

If that doesn't work, try:
```env
SHIPROCKET_PICKUP_LOCATION_ID=2
```

## Verify It Works

After updating `.env`, test with a simple order:

1. Go to checkout
2. Add product
3. Enter pincode: **121005** (from your Primary location)
4. Select COD
5. Place order
6. Check server logs for Shiprocket response

## What to Look For in Logs

**Success:**
```
✓ Shiprocket order created: { shiprocketOrderId: ..., shipmentId: ... }
📦 Shipping with courier: Delhivery
✓ Order shipped successfully: { awb: [AWB_CODE], courier: Delhivery }
```

**Failure:**
```
Failed to create Shiprocket order: [error message]
```

## If Still Not Working

1. **Check Account Status:**
   - Go to Shiprocket dashboard
   - Check if account is active
   - Check if there are any warnings/alerts

2. **Verify Pickup Location:**
   - Ensure Primary location is marked as "Active"
   - Check if it has all required fields

3. **Contact Shiprocket Support:**
   - Email: support@shiprocket.in
   - Mention: API key not returning pickup locations
   - Provide: Account email and API key

## Recommended Action

**Try Option 1 first** (regenerate API key):

1. Go to https://app.shiprocket.in/settings/api-keys
2. Generate new key
3. Update `.env`
4. Restart server
5. Test order

This usually fixes API timeout issues.

---

**Status:** API issue detected. Try regenerating API key.
