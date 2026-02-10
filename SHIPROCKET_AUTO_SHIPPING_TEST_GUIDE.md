# Shiprocket Auto Shipping - Testing Guide

## Prerequisites

1. **Shiprocket Account Setup:**
   - Account: MYSTATIONERYHUB1@GMAIL.COM
   - API Key: Already configured in `.env`
   - Pickup Location: Must be configured in Shiprocket dashboard
   - Courier Partners: Must be activated in Shiprocket dashboard

2. **Serviceable Pincodes:**
   - Check which pincodes are serviceable by running:
   ```bash
   node scripts/test-serviceable-pincodes.js
   ```
   - Use only serviceable pincodes for testing

3. **Products with Weight:**
   - All products must have weight defined
   - Weight is used for shipping rate calculation
   - Default: 300g if not specified

## Test Scenario 1: COD Order (Automatic Shipping)

### Steps:
1. Open browser and go to `http://localhost:3000`
2. Add a product to cart
3. Go to checkout
4. Fill in shipping details:
   - Name: Test User
   - Email: test@example.com
   - Phone: 9999999999
   - Address: Test Address
   - City: Test City
   - State: Test State
   - Pincode: **Use a serviceable pincode** (check test results)
5. Select **COD** as payment method
6. Click "Place Order"

### Expected Results:
- ✅ Order created successfully
- ✅ Redirected to order confirmation page
- ✅ Order status shows "shipped"
- ✅ AWB code is displayed
- ✅ Courier name is shown
- ✅ Delivery tracking number is available

### Logs to Check:
```
🚀 Automatically creating Shiprocket order for orderId: [orderId]
✓ Shiprocket order created: { shiprocketOrderId: ..., shipmentId: ... }
📦 Shipping with courier: [Courier Name]
✓ Order shipped successfully: { awb: [AWB_CODE], courier: [Courier Name] }
```

## Test Scenario 2: Razorpay Order (Automatic Shipping After Payment)

### Steps:
1. Open browser and go to `http://localhost:3000`
2. Add a product to cart
3. Go to checkout
4. Fill in shipping details (same as above)
5. Select **Razorpay** as payment method
6. Click "Place Order"
7. Razorpay modal opens
8. Use test card: `4111 1111 1111 1111`
9. Expiry: Any future date (e.g., 12/25)
10. CVV: Any 3 digits (e.g., 123)
11. Click "Pay"

### Expected Results:
- ✅ Payment processed successfully
- ✅ Order status changes to "confirmed"
- ✅ Shiprocket order created automatically
- ✅ Order status changes to "shipped"
- ✅ AWB code is displayed
- ✅ Redirected to order confirmation page

### Logs to Check:
```
Payment verified successfully
🚀 Automatically creating Shiprocket order for orderId: [orderId]
✓ Shiprocket order created: { shiprocketOrderId: ..., shipmentId: ... }
📦 Shipping with courier: [Courier Name]
✓ Order shipped successfully: { awb: [AWB_CODE], courier: [Courier Name] }
```

## Test Scenario 3: Pincode Validation

### Steps:
1. Go to checkout
2. Fill in all details
3. Enter pincode in the pincode field
4. Tab out or click elsewhere

### Expected Results:
- ✅ Pincode validation happens automatically
- ✅ Shows "✓ Serviceable" if pincode is serviceable
- ✅ Shows "❌ Not serviceable" if pincode is not serviceable
- ✅ Checkout button disabled if pincode not serviceable

### Logs to Check:
```
Validating pincode: [pincode]
Pincode validation: serviceable/not serviceable
```

## Test Scenario 4: Multiple Products in Order

### Steps:
1. Add 3-4 different products to cart
2. Go to checkout
3. Fill in shipping details
4. Select COD
5. Place order

### Expected Results:
- ✅ All products included in Shiprocket order
- ✅ Weight calculated correctly (sum of all products)
- ✅ Order shipped with correct total weight
- ✅ All items visible in order details

### Logs to Check:
```
Order creation - Weight calculation DEBUG: {
  itemsCount: 3,
  totalWeight: [calculated weight],
  itemsDetail: [...]
}
Shiprocket order payload: {
  order_items: [
    { name: "Product 1", units: 1, ... },
    { name: "Product 2", units: 2, ... },
    { name: "Product 3", units: 1, ... }
  ],
  weight: [total weight]
}
```

## Test Scenario 5: Admin Dashboard Verification

### Steps:
1. Go to admin dashboard: `http://localhost:3000/admin`
2. Click "Orders"
3. Find the test order
4. Click on order to view details

### Expected Results:
- ✅ Order status shows "shipped"
- ✅ Shiprocket Order ID is displayed
- ✅ AWB code is displayed
- ✅ Courier name is shown
- ✅ Delivery tracking shows AWB code

### Admin Delivery Page:
1. Go to admin dashboard
2. Click "Delivery"
3. Find the test order

### Expected Results:
- ✅ Tracking number matches AWB code
- ✅ Carrier shows courier name
- ✅ Status shows "picked_up"
- ✅ Estimated delivery date is set

## Troubleshooting

### Issue: "No shipping rates available for this pincode"
**Cause:** Pincode not serviceable by any courier
**Solution:** 
- Use a serviceable pincode from test results
- Contact Shiprocket support to add coverage

### Issue: "Failed to create Shiprocket order"
**Cause:** Shiprocket account not properly configured
**Solution:**
- Check Shiprocket dashboard for pickup location
- Verify courier partners are activated
- Check API key is valid

### Issue: Order created but not shipped
**Cause:** Shiprocket API error
**Solution:**
- Check server logs for detailed error
- Verify all required fields are present
- Check Shiprocket account status

### Issue: "Invalid payment signature"
**Cause:** Razorpay signature verification failed
**Solution:**
- Verify RAZORPAY_KEY_SECRET is correct
- Check payment details match

### Issue: Pincode validation always fails
**Cause:** Shiprocket API not responding
**Solution:**
- Check internet connection
- Verify API key is valid
- Check Shiprocket service status

## Performance Metrics

### Expected Response Times:
- Order creation: 200-500ms
- Shiprocket order creation: 1-3 seconds
- Shipping rate fetch: 1-2 seconds
- Courier assignment: 1-2 seconds
- Total order to shipped: 3-8 seconds

### Logs to Monitor:
```
POST /api/orders [time]ms
POST /api/payments/verify [time]ms
POST /api/shiprocket/shipping-rates [time]ms
POST /api/shiprocket/orders/create [time]ms
POST /api/shiprocket/orders/ship [time]ms
```

## Database Verification

### Check Order in MongoDB:
```javascript
db.orders.findOne({ _id: ObjectId("[orderId]") })
```

**Expected fields:**
- `orderStatus`: "shipped"
- `shiprocketOrderId`: [number]
- `shiprocketShipmentId`: [number]
- `shiprocketAWB`: "[AWB_CODE]"
- `shiprocketCourier`: "[Courier Name]"
- `totalWeight`: [weight in kg]

### Check Delivery in MongoDB:
```javascript
db.deliveries.findOne({ orderId: "[orderId]" })
```

**Expected fields:**
- `trackingNumber`: "[AWB_CODE]"
- `carrier`: "[Courier Name]"
- `status`: "picked_up"
- `shiprocketAWB`: "[AWB_CODE]"
- `estimatedDeliveryDate`: [date]

## Success Checklist

- [ ] COD order created and shipped automatically
- [ ] Razorpay order created and shipped after payment
- [ ] Pincode validation working
- [ ] Multiple products handled correctly
- [ ] Weight calculated correctly
- [ ] AWB code generated
- [ ] Delivery tracking updated
- [ ] Admin dashboard shows correct status
- [ ] Order confirmation page shows tracking info
- [ ] No errors in server logs

## Next Steps

1. Test with real Shiprocket account
2. Verify all serviceable pincodes
3. Test with different product combinations
4. Monitor performance metrics
5. Set up webhook for real-time tracking updates
6. Configure return order handling
