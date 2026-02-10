# Multi-Pincode Order Testing Guide

## Quick Test Steps

### Test 1: Verify Weight Calculation Fix
1. Go to admin panel → Orders
2. Create a new order with a product that has weight (e.g., NCERT book with 300g)
3. Check the order details - should show weight as 0.3kg (not 0.5kg)
4. Server logs should show: `totalWeight: 0.3` (not 0.5)

**Expected Result**: Weight calculated correctly from product data

---

### Test 2: Verify Pincode Validation Before Checkout
1. Go to checkout page
2. Enter an unserviceable pincode (e.g., 999999)
3. Click on another field (blur event triggers validation)
4. Should see error: "Pincode is not serviceable"
5. Try to click "Place Order" - should be blocked

**Expected Result**: Cannot proceed to order creation with unserviceable pincode

---

### Test 3: Verify Serviceable Pincode Works
1. Go to checkout page
2. Enter a serviceable pincode (e.g., 201310 or 203201)
3. Click on another field - should see "✓ Pincode is serviceable"
4. Click "Place Order" - should proceed normally

**Expected Result**: Order created successfully with serviceable pincode

---

### Test 4: Verify Admin Can Fetch Shipping Rates
1. Create an order with serviceable pincode
2. Go to admin panel → Orders → Order Details
3. Should see "Loading shipping rates..." then list of available couriers
4. Should NOT see 404 error

**Expected Result**: Shipping rates displayed correctly

---

### Test 5: Verify Store Pincode Configuration
1. Go to admin panel → Settings
2. Scroll to "Store Address (For Invoices)"
3. Verify "Store Pincode" field is visible and editable
4. Change it to a different pincode (e.g., 110001)
5. Save settings
6. Create a new order - should use the new store pincode for shipping rates

**Expected Result**: Store pincode can be configured and is used for shipping calculations

---

## Server Log Indicators

### Good Signs ✓
```
Product fetched: {productId: '...', name: 'NCERT...', weight: 300, weightUnit: 'g'}
Order item created: {name: '...', weight: 300, weightUnit: 'g', quantity: 1}
Order creation - Weight calculation: {itemsCount: 1, totalWeight: 0.3, items: [...]}
Shipping Rates Request: {pickup_postcode: '121006', delivery_postcode: '201310', weight: 0.3, ...}
```

### Bad Signs ✗
```
Order creation - Weight calculation: {itemsCount: 1, totalWeight: 0.5, items: [...]}  // Wrong!
Shipping Rates Request: {..., weight: 0.5, ...}  // Should be 0.3
Failed to get shipping rates: {message: 'Request failed with status code 404', ...}  // Before validation
```

---

## Troubleshooting

### Issue: Still seeing weight as 0.5kg
**Solution**: 
- Clear browser cache and restart dev server
- Check that `lib/utils/shippingCalculator.ts` has the fix applied
- Verify product has weight data in database

### Issue: Pincode validation not working
**Solution**:
- Check that `/api/shiprocket/check-serviceability` endpoint exists
- Verify Shiprocket credentials in `.env`
- Check browser console (F12) for API errors

### Issue: Order creation blocked even with valid pincode
**Solution**:
- Check that pincode is actually serviceable (try 201310 or 203201)
- Verify store pincode is set correctly in settings
- Check server logs for validation errors

### Issue: Admin can't fetch shipping rates
**Solution**:
- Verify order has correct weight (check order details)
- Verify delivery pincode is valid (5-6 digits)
- Check Shiprocket credentials are correct
- Try a different pincode combination

---

## Test Pincodes

### Serviceable from 121006 (Faridabad)
- 201310 (Noida)
- 203201 (Ghaziabad)
- 110001 (Delhi)
- 122001 (Gurugram)

### Unserviceable (for testing error handling)
- 999999
- 000000
- 123 (too short)

---

## Database Verification

### Check Product Weight
```javascript
// In MongoDB shell
db.products.findOne({name: /NCERT/}, {name: 1, weight: 1, weightUnit: 1})
// Should show: {name: "...", weight: 300, weightUnit: "g"}
```

### Check Store Pincode
```javascript
// In MongoDB shell
db.settings.findOne({}, {storePincode: 1})
// Should show: {storePincode: "121006"}
```

### Check Order Weight
```javascript
// In MongoDB shell
db.orders.findOne({}, {totalWeight: 1, items: 1})
// Should show: {totalWeight: 0.3, items: [{weight: 300, ...}]}
```

---

## Performance Expectations

- Pincode validation: 1-2 seconds (includes Shiprocket API call)
- Order creation: 1-2 seconds
- Shipping rates fetch: 2-3 seconds (includes Shiprocket authentication)

If significantly slower, check:
- Network latency to Shiprocket API
- Database connection speed
- Server CPU/memory usage
