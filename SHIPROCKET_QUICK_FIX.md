# 🔧 Quick Fix - Shiprocket Pickup Location

## What We Know

✅ **Couriers:** 142 available, many ACTIVE (you showed the screenshot)
❌ **Pickup Location:** Not configured (API returns 404)

## The Fix (2 Steps)

### Step 1: Add Pickup Location Manually

Go to: **https://app.shiprocket.in/settings/pickup-locations**

Click **"Add Pickup Location"** and fill in:

```
Location Name: Radhe Stationery
Address: Your warehouse address in Faridabad
City: Faridabad
State: Haryana
Pincode: 121006
Phone: Your phone number
Email: mystationeryhub1@gmail.com
```

Click **Save**

### Step 2: Get the Pickup Location ID

After saving, you'll see the location in the list. Look for the **ID** number (usually a 4-5 digit number).

Update your `.env` file:

```env
SHIPROCKET_PICKUP_LOCATION_ID=<the-id-you-see>
```

For example:
```env
SHIPROCKET_PICKUP_LOCATION_ID=12345
```

## Verify It Works

After updating `.env`, run:

```bash
node scripts/check-shiprocket-setup.js
```

You should see:
```
✓ Pickup Locations: Configured
✓ Courier Partners: Activated
```

## Then Test

1. Go to checkout
2. Enter pincode: **121006** (your store pincode)
3. Select COD
4. Place order
5. ✅ Should be automatically shipped

## Why This Works

- **Couriers:** Already active ✅
- **Pickup Location:** Just needs to be added
- **Service Areas:** Couriers already configured
- **Result:** Orders can be shipped

---

**Time Required:** 5 minutes

**Status:** Almost done! Just need to add pickup location.
