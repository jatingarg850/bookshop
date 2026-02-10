# 🚀 Shiprocket Account Setup - Complete Guide

## Current Status

Your Shiprocket account is **NOT CONFIGURED**:
- ❌ No pickup location added
- ❌ No courier partners activated
- ❌ Result: 0 serviceable pincodes

## Root Cause

Shiprocket needs to know:
1. **WHERE you're shipping FROM** (Pickup Location)
2. **WHO will deliver** (Courier Partners)
3. **WHERE you can deliver TO** (Service Areas)

Without these, every pincode returns 404 (not serviceable).

---

## Step-by-Step Setup

### STEP 1: Add Pickup Location

**URL:** https://app.shiprocket.in/settings/pickup-locations

1. Click "Add Pickup Location" button
2. Fill in the form:
   ```
   Location Name: Your Store/Warehouse Name
   Address: Full warehouse address
   City: Your city
   State: Your state
   Pincode: 121006 (or your actual store pincode)
   Phone: Your contact number
   Email: Your email
   ```
3. Click "Save"
4. **IMPORTANT:** Note the **Pickup Location ID** (you'll see it in the list)
5. Update `.env`:
   ```
   SHIPROCKET_PICKUP_LOCATION_ID=<your-id>
   ```

### STEP 2: Activate Courier Partners

**URL:** https://app.shiprocket.in/settings/courier-partners

You should see a list of available couriers. For each one you want to use:

1. **Delhivery** (Recommended - covers most of India)
   - Click "Activate" or "Connect"
   - Select service areas (states/pincodes)
   - Save

2. **Ecom Express** (Good coverage)
   - Click "Activate"
   - Configure service areas
   - Save

3. **DTDC** (Optional)
   - Click "Activate"
   - Configure service areas
   - Save

**Important:** You need at least ONE courier activated to ship orders.

### STEP 3: Configure Service Areas

For each activated courier:
1. Click on the courier name
2. Select states/pincodes you want to serve
3. Save

**Recommended:** Start with your state and nearby states.

### STEP 4: Verify Setup

Run this command to verify everything is configured:

```bash
node scripts/check-shiprocket-setup.js
```

Expected output:
```
✓ Pickup Locations: Configured
✓ Courier Partners: Activated
```

### STEP 5: Find Serviceable Pincodes

Once couriers are activated, run:

```bash
node scripts/test-serviceable-pincodes.js
```

This will show which pincodes are serviceable and which couriers serve them.

---

## Troubleshooting

### Issue: "No pickup locations found"
**Solution:**
- Go to Shiprocket Dashboard → Settings → Pickup Locations
- Click "Add Pickup Location"
- Fill in all required fields
- Save and note the ID

### Issue: "No courier partners activated"
**Solution:**
- Go to Shiprocket Dashboard → Settings → Courier Partners
- Click "Activate" on at least one courier
- Configure service areas
- Save

### Issue: "Still 0 serviceable pincodes after setup"
**Solution:**
- Verify courier service areas include your pincodes
- Check if couriers are actually activated (status should be "Active")
- Wait 5-10 minutes for changes to propagate
- Try again

### Issue: "API Key is invalid"
**Solution:**
- Go to Shiprocket Dashboard → Settings → API Keys
- Generate a new API key
- Update `.env` with new key:
  ```
  SHIPROCKET_API_KEY=<new-key>
  ```

---

## Expected Results After Setup

### After Adding Pickup Location:
```
✓ Found 1 pickup location(s):
  Location 1:
    ID: 12345
    Name: Your Store
    Pincode: 121006
    City: Faridabad
```

### After Activating Couriers:
```
✓ Found 3 courier partner(s):
  Courier 1:
    ID: 1
    Name: Delhivery
    Status: Active
  
  Courier 2:
    ID: 2
    Name: Ecom Express
    Status: Active
  
  Courier 3:
    ID: 3
    Name: DTDC
    Status: Active
```

### After Configuring Service Areas:
```
✓ SERVICEABLE PINCODES (15):
  110001: Delhivery (₹50, 2d), Ecom Express (₹55, 2d)
  110002: Delhivery (₹50, 2d)
  201301: Delhivery (₹45, 1d), DTDC (₹48, 2d)
  ... and more
```

---

## How It Works After Setup

### Order Flow:
```
1. User places order with COD/Razorpay
2. System creates order in database
3. System calls Shiprocket API:
   - Sends order details
   - Sends pickup location ID
   - Sends delivery pincode
4. Shiprocket creates order
5. System fetches available couriers for that pincode
6. System selects cheapest courier
7. System ships order with selected courier
8. System gets AWB code
9. User gets tracking info
```

### What Shiprocket Does:
- Validates pickup location exists
- Checks if delivery pincode is serviceable
- Finds available couriers
- Assigns courier and generates AWB
- Handles pickup and delivery

---

## Configuration Checklist

- [ ] Pickup location added in Shiprocket dashboard
- [ ] Pickup location ID noted
- [ ] `.env` updated with correct `SHIPROCKET_PICKUP_LOCATION_ID`
- [ ] At least one courier activated
- [ ] Courier service areas configured
- [ ] `node scripts/check-shiprocket-setup.js` shows ✓ for both
- [ ] `node scripts/test-serviceable-pincodes.js` shows serviceable pincodes
- [ ] Ready to test orders

---

## Testing After Setup

### Test COD Order:
1. Go to checkout
2. Enter a serviceable pincode
3. Select COD
4. Place order
5. Order should be automatically shipped

### Test Razorpay Order:
1. Go to checkout
2. Enter a serviceable pincode
3. Select Razorpay
4. Complete payment
5. Order should be automatically shipped

---

## Support

If you encounter issues:

1. **Check Shiprocket Dashboard:**
   - Verify pickup location is active
   - Verify couriers are activated
   - Check service areas include your pincodes

2. **Run Diagnostic Scripts:**
   ```bash
   node scripts/check-shiprocket-setup.js
   node scripts/test-serviceable-pincodes.js
   ```

3. **Check Server Logs:**
   - Look for Shiprocket API errors
   - Check if API key is valid

4. **Contact Shiprocket Support:**
   - Email: support@shiprocket.in
   - They can help with account configuration

---

## Important Notes

- **API Key:** Already configured in `.env`
- **Pickup Location ID:** Update after adding location
- **Couriers:** Need at least one activated
- **Service Areas:** Configure for your delivery zones
- **Testing:** Use serviceable pincodes only

---

## Next Steps

1. ✅ Go to Shiprocket Dashboard
2. ✅ Add pickup location
3. ✅ Activate courier partners
4. ✅ Configure service areas
5. ✅ Update `.env` with pickup location ID
6. ✅ Run verification scripts
7. ✅ Test orders

Once complete, your system will automatically:
- Create Shiprocket orders
- Select cheapest courier
- Generate AWB codes
- Update tracking info
- Notify customers

**Status:** Ready to configure! 🚀
