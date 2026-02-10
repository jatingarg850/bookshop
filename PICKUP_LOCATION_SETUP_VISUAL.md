# 📍 Pickup Location Setup - Visual Guide

## Navigate to Pickup Locations

**URL:** https://app.shiprocket.in/settings/pickup-locations

## What You'll See

### If No Locations Exist:
```
┌─────────────────────────────────────┐
│  Pickup Locations                   │
│                                     │
│  [+ Add Pickup Location]            │
│                                     │
│  No pickup locations found          │
└─────────────────────────────────────┘
```

### If Locations Exist:
```
┌─────────────────────────────────────┐
│  Pickup Locations                   │
│                                     │
│  [+ Add Pickup Location]            │
│                                     │
│  Location Name    | Pincode | ID    │
│  ─────────────────┼─────────┼────── │
│  Radhe Stationery │ 121006  │ 12345 │
│  Store Branch     │ 110001  │ 12346 │
└─────────────────────────────────────┘
```

## Steps to Add Pickup Location

### 1. Click "Add Pickup Location" Button
```
┌─────────────────────────────────────┐
│  Add Pickup Location                │
│                                     │
│  Location Name: [____________]      │
│  Address:       [____________]      │
│  City:          [____________]      │
│  State:         [____________]      │
│  Pincode:       [____________]      │
│  Phone:         [____________]      │
│  Email:         [____________]      │
│                                     │
│  [Save]  [Cancel]                   │
└─────────────────────────────────────┘
```

### 2. Fill in the Form

**Location Name:** Radhe Stationery
**Address:** Your warehouse address
**City:** Faridabad
**State:** Haryana
**Pincode:** 121006
**Phone:** Your contact number
**Email:** mystationeryhub1@gmail.com

### 3. Click Save

After saving, you'll see:
```
✓ Pickup location added successfully
```

### 4. Find the ID

The location will appear in the list:
```
Location Name    | Pincode | ID    | Actions
─────────────────┼─────────┼───────┼─────────
Radhe Stationery │ 121006  │ 12345 │ Edit/Delete
```

**Copy the ID** (in this example: 12345)

## Update .env

Edit your `.env` file and update:

```env
SHIPROCKET_PICKUP_LOCATION_ID=12345
```

Replace `12345` with your actual ID.

## Verify

After updating `.env`, restart your server and run:

```bash
node scripts/check-shiprocket-setup.js
```

Expected output:
```
✓ Pickup Locations: Configured
✓ Courier Partners: Activated
```

## Test Order

1. Go to http://localhost:3000/checkout
2. Add product to cart
3. Enter pincode: 121006
4. Select COD
5. Place order
6. ✅ Order should be automatically shipped

---

**That's it!** Your system will now automatically:
- Create Shiprocket orders
- Select cheapest courier
- Generate AWB codes
- Update tracking info
