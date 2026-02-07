# Quick Test Checklist - Shiprocket Shipping Rates

## Before Testing
- [ ] Server running: `npm run dev`
- [ ] .env.local has SHIPROCKET credentials
- [ ] Browser F12 console open
- [ ] Terminal visible for server logs

## Test Steps

### 1. Create Test Order with Known Pincodes
Go to: http://localhost:3000/admin/orders
- Find or create order with delivery pincode: **560001** (Bangalore)
- Shipping from: **110001** (Delhi - default)
- Order status must be: **confirmed**

### 2. Click "Ship Order"
Expected behavior (watch both console and terminal):

**Browser Console Should Show:**
```
📊 Calculating shipping rates: {
  weight: 2.5,
  pickup_postcode: '110001',
  delivery_postcode: '560001',
  payment_method: 'cod'
}
📤 Requesting shipping rates with payload: {...}
✅ Received shipping rates: [
  { courier_name: 'Delhivery', rate: 85, etd: '2' },
  ...
]
```

**Server Terminal Should Show:**
```
🔐 Authenticating with Shiprocket...
✅ Shiprocket authentication successful
📦 Shipping Rates Request: {
  pickup_postcode: '110001',
  delivery_postcode: '560001',
  weight: 2.5,
  cod: 1
}
📤 Sending to Shiprocket API: {...}
✅ Shiprocket Response: {rates: [...]}
```

### 3. Expected UI Result
- Courier list displays (Delhivery, FedEx, etc.)
- Can select a courier
- "Ship Order" button becomes enabled
- Red error box NOT shown

### 4. If Error Shows
**Red error box appears with message:**
Check the error message:
- "Invalid delivery pincode: ABC" → Pincode must be 6 digits
- "Invalid weight calculated: 0" → Order items not weighing
- "Failed to authenticate" → Check SHIPROCKET_EMAIL and PASSWORD in .env.local
- "No shipping rates available" → Route might not be serviceable by Shiprocket

**Action:** Check SHIPROCKET_DEBUGGING_GUIDE.md for detailed fixes

## Success Criteria
- [ ] Shiprocket authenticates (🔐 ✅ shown in logs)
- [ ] Rates API called (📦 logs show request/response)
- [ ] Courier list displays in UI
- [ ] Can select courier
- [ ] No red error boxes
- [ ] Browser console shows ✅ logs
- [ ] Server logs show ✅ messages

## Alternative Test Routes
If 110001→560001 fails, try:
- **110001 → 400001** (Mumbai)
- **110001 → 700001** (Kolkata)
- **110001 → 452001** (Indore)

## Reset Instructions
If stuck, try:
```bash
# Restart server
npm run dev

# Check credentials
cat .env.local | grep SHIPROCKET

# Verify pickup location
# 1. Log in to https://app.shiprocket.in
# 2. Settings → Pickup Locations
# 3. Check location ID 1 is active
```

## Performance Check
Metrics to monitor:
- Authentication: ~1-2 seconds
- Rate calculation: ~2-3 seconds
- Total time: Should be < 5 seconds

If slower, check:
- Internet connection
- Shiprocket API status
- Server resources

---

**See SHIPROCKET_FIX_SUMMARY.md for detailed implementation**
**See SHIPROCKET_DEBUGGING_GUIDE.md for troubleshooting**
