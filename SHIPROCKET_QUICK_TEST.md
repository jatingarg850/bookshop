# Shiprocket Quick Test Guide

## 🚀 Quick Start (2 minutes)

### Test Shipping Rates
1. Go to: **http://localhost:3000/admin/shiprocket-test**
2. Keep Pickup: `121006` (Faridabad)
3. Change Delivery to: `110001` (Delhi) ← **Use this for testing**
4. Keep Weight: `1.0` kg
5. Click **Test Route**
6. ✅ You should see 2-3 courier options with prices

### Test Full Order Shipping
1. Go to: **http://localhost:3000/checkout**
2. Add a product to cart
3. Enter delivery address with pincode: `110001` (Delhi)
4. Complete checkout
5. Go to: **http://localhost:3000/admin/orders**
6. Click your order
7. Select a courier and click "Ship Order"
8. ✅ You should see: `Order shipped successfully! AWB: [number]`

---

## ✅ Working Pincodes (Tested)

From Faridabad (121006) to:
- **110001** - Delhi ✅
- **560001** - Bangalore ✅
- **400001** - Mumbai ✅
- **500001** - Hyderabad ✅
- **411001** - Pune ✅

---

## ❌ Why 404 Errors Happen

| Scenario | Error | Solution |
|----------|-------|----------|
| Same city (121006 → 121006) | 404 | Use different city |
| Non-serviceable route | 404 | Use major metro |
| Invalid pincode | 400 | Use 6-digit pincode |
| Bad credentials | 401 | Check .env file |

---

## 🔍 Debug Checklist

- [ ] Delivery pincode is different from pickup (121006)
- [ ] Delivery pincode is a major city (Delhi, Mumbai, etc.)
- [ ] Product has weight set (in grams)
- [ ] Order status is "confirmed"
- [ ] Check browser console (F12) for detailed logs
- [ ] Check server logs in terminal

---

## 📋 Expected Success Response

```json
{
  "success": true,
  "rates": [
    {
      "courier_name": "Delhivery",
      "rate": 85,
      "etd": "2"
    },
    {
      "courier_name": "Bluedart",
      "rate": 110,
      "etd": "1"
    }
  ]
}
```

---

## 🎯 Next Steps

1. ✅ Test with Delhi pincode (110001)
2. ✅ Create a test order with Delhi address
3. ✅ Ship the order and get AWB
4. ✅ Track the shipment
5. ✅ System is production-ready!

---

## 📞 Need Help?

See: `SHIPROCKET_TROUBLESHOOTING.md` for detailed solutions
