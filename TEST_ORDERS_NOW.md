# Test Multi-Pincode Orders NOW

## 🚀 Quick Start (Mock Mode Enabled)

Mock mode is **ENABLED** in `.env`:
```
SHIPROCKET_MOCK_MODE=true
```

This means you can test the complete order flow with mock shipping rates.

## 📝 Test Steps

### Step 1: Create an Order
1. Go to http://localhost:3000
2. Add a product to cart (e.g., "Computer Science Basics")
3. Go to checkout
4. Enter shipping details:
   - Name: Test User
   - Email: test@example.com
   - Phone: 9876543210
   - Address: Test Address
   - City: Test City
   - State: Test State
   - **Pincode: 203201** (any pincode works in mock mode)
5. Click "Place Order"

### Step 2: Verify Order Created
1. Go to admin panel (http://localhost:3000/admin)
2. Click "Orders"
3. Find your order
4. Click on it to view details

### Step 3: Check Weight Calculation
In the order details, you should see:
- **Weight: 0.4kg** (not 0.5kg!)
- This is correct for "Computer Science Basics" which has 400g weight

### Step 4: View Mock Shipping Rates
1. In order details, scroll to "Ship Order"
2. You should see mock rates:
   - Delhivery (Mock): ₹50, 2-3 days
   - Ecom Express (Mock): ₹60, 3-4 days
   - DTDC (Mock): ₹45, 2-3 days

### Step 5: Ship the Order
1. Select a courier (e.g., Delhivery)
2. Click "Ship Order"
3. Should see success message with mock AWB

## ✅ What's Working

- ✅ Weight calculation (300g = 0.3kg, 400g = 0.4kg, etc.)
- ✅ Pincode validation (accepts any pincode in mock mode)
- ✅ Order creation with correct weight
- ✅ Mock shipping rates
- ✅ Delivery tracking creation
- ✅ Order confirmation

## 🔄 When Ready for Real Shiprocket

1. Get correct API key from MYSTATIONERYHUB1@GMAIL.COM account
2. Configure Shiprocket account:
   - Add pickup location
   - Activate courier partners
3. Update `.env`:
   ```
   SHIPROCKET_API_KEY=your-real-api-key
   SHIPROCKET_MOCK_MODE=false
   ```
4. Restart dev server
5. Test with real pincodes

## 📊 Test Scenarios

### Scenario 1: Light Product (300g)
- Product: "History of India - Complete Guide"
- Expected weight: 0.3kg
- Expected shipping: ₹50 (mock)

### Scenario 2: Heavy Product (450g)
- Product: "Economics - Principles & Practice"
- Expected weight: 0.45kg
- Expected shipping: ₹50 (mock)

### Scenario 3: Multiple Products
- Add 2-3 products to cart
- Expected weight: Sum of all product weights
- Example: 300g + 400g = 0.7kg

## 🐛 Troubleshooting

### Issue: Weight shows as 0.5kg
**Solution**: 
- Clear browser cache (Ctrl+Shift+Delete)
- Restart dev server
- Create new order

### Issue: Pincode validation fails
**Solution**:
- In mock mode, any pincode should work
- Check browser console for errors
- Verify SHIPROCKET_MOCK_MODE=true in .env

### Issue: No shipping rates shown
**Solution**:
- Check order weight is > 0
- Verify SHIPROCKET_MOCK_MODE=true
- Check server logs for errors

## 📞 Next Steps

1. **Test thoroughly** with mock mode
2. **Document any issues** you find
3. **When ready**, contact Shiprocket support to:
   - Activate MYSTATIONERYHUB1@GMAIL.COM account
   - Add pickup location (Faridabad, 121006)
   - Activate courier partners
4. **Update .env** with real API key
5. **Test with real pincodes**

## ✨ Summary

**Status**: ✅ Ready for testing
- Mock mode enabled
- Weight calculation fixed
- Pincode validation working
- All products have weight data
- Complete order flow functional

**Next**: Create test orders and verify everything works!
