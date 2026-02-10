# Automatic Shiprocket Order Creation & Shipping Implementation

## Overview
Removed mock mode and implemented automatic Shiprocket product creation and order shipping when users buy products. The system now:
- Automatically creates Shiprocket orders for COD purchases immediately
- Automatically creates Shiprocket orders for Razorpay purchases after payment verification
- Automatically ships orders with the cheapest available courier
- Updates delivery tracking with AWB codes

## Changes Made

### 1. Environment Configuration (.env)
**Removed:** `SHIPROCKET_MOCK_MODE=true`
- Mock mode is now completely disabled
- System uses real Shiprocket API for all operations

### 2. Order Creation Flow (app/api/orders/route.ts)

**New Function:** `createShiprocketOrder(order)`
- Automatically creates Shiprocket order from order data
- Calculates weight from order items
- Transforms order items to Shiprocket format
- Gets available shipping rates for the delivery pincode
- Automatically ships with the first (cheapest) available courier
- Updates order with Shiprocket IDs and AWB code
- Creates/updates delivery record with tracking information

**COD Order Handling:**
- When COD payment method is selected, `createShiprocketOrder()` is called immediately after order creation
- Order is automatically shipped without waiting for payment

### 3. Payment Verification Flow (app/api/payments/verify/route.ts)

**Razorpay Payment Verification:**
1. Verifies Razorpay signature
2. Updates order payment status to 'paid'
3. Sets order status to 'confirmed'
4. **NEW:** Automatically calls `createShiprocketOrder()` to create and ship the order
5. Returns success response

**Error Handling:**
- If Shiprocket order creation fails, payment verification still succeeds
- Errors are logged but don't block the payment confirmation
- This ensures payment is confirmed even if shipping setup has issues

### 4. Shiprocket Order Creation (app/api/shiprocket/orders/create/route.ts)

**Removed:** Mock mode check and MOCK_ORDER_RESPONSE
- Now only uses real Shiprocket API
- Endpoint can still be called manually if needed
- Validates order exists and hasn't been shipped yet

### 5. Shiprocket Order Shipping (app/api/shiprocket/orders/ship/route.ts)

**Removed:** Mock mode check and MOCK_SHIP_RESPONSE
- Now only uses real Shiprocket API
- Endpoint can still be called manually for manual courier assignment
- Updates order and delivery records with AWB code

## Automatic Shipping Logic

### For COD Orders:
```
User Checkout (COD selected)
    ↓
Create Order (POST /api/orders)
    ├─ Validate products & stock
    ├─ Calculate weight, tax, shipping
    ├─ Create order in database
    ├─ Create delivery record
    └─ Automatically create Shiprocket order
        ├─ Get shipping rates
        ├─ Select cheapest courier
        ├─ Ship order with selected courier
        └─ Update order with AWB code
    ↓
Order Confirmation Page
```

### For Razorpay Orders:
```
User Checkout (Razorpay selected)
    ↓
Create Order (POST /api/orders)
    ├─ Validate products & stock
    ├─ Calculate weight, tax, shipping
    ├─ Create order in database (status: pending)
    └─ Create delivery record
    ↓
Razorpay Payment Modal
    ↓
Payment Verification (POST /api/payments/verify)
    ├─ Verify Razorpay signature
    ├─ Update order status to 'confirmed'
    └─ Automatically create Shiprocket order
        ├─ Get shipping rates
        ├─ Select cheapest courier
        ├─ Ship order with selected courier
        └─ Update order with AWB code
    ↓
Order Confirmation Page
```

## Data Flow

### Order Items to Shiprocket Transformation:
```
Order Item (Database)
├─ productId
├─ name
├─ sku
├─ quantity
├─ priceAtPurchase
├─ weight (in grams)
├─ weightUnit
└─ dimensions

    ↓ (Transformed to)

Shiprocket Order Item
├─ name
├─ sku (or 'N/A')
├─ units (quantity)
└─ selling_price (priceAtPurchase)

Shiprocket Order Metadata
├─ order_id (MongoDB ObjectId as string)
├─ order_date (ISO format)
├─ pickup_location_id (from env)
├─ billing_* (from shippingDetails)
├─ payment_method ('COD' or 'Prepaid')
├─ sub_total
├─ weight (calculated in kg)
└─ dimensions (default: 10x10x10 cm)
```

### Weight Calculation:
- Uses stored `order.totalWeight` if available
- Falls back to `calculateOrderWeight(order.items)`
- Minimum enforced: 0.5kg if calculated weight is 0 or invalid
- Supports multiple weight units (g, kg, mg, oz, lb)
- Includes volumetric weight calculation if dimensions available

## Courier Selection

**Automatic Selection:**
- Fetches available couriers for delivery pincode
- Selects first courier (typically cheapest)
- Automatically assigns courier and generates AWB code

**Available Couriers (based on Shiprocket account):**
- Delhivery
- Ecom Express
- DTDC
- And others based on account configuration

## Delivery Tracking Updates

**On Successful Shipping:**
- Creates or updates delivery record with:
  - `trackingNumber`: AWB code from Shiprocket
  - `carrier`: Courier name
  - `status`: 'picked_up'
  - `shiprocketAWB`: AWB code for reference
  - `estimatedDeliveryDate`: 5 days from order date

## Error Handling

**Graceful Degradation:**
- If Shiprocket order creation fails, order is still confirmed
- If shipping rates unavailable, order is confirmed but not shipped
- If courier assignment fails, order is confirmed but not shipped
- All errors are logged for debugging

**Retry Mechanism:**
- Manual endpoints still available:
  - `POST /api/shiprocket/orders/create` - Create order manually
  - `POST /api/shiprocket/orders/ship` - Ship order manually

## Configuration

**Required Environment Variables:**
```
SHIPROCKET_API_KEY=<your-api-key>
SHIPROCKET_PICKUP_LOCATION_ID=1
NEXT_PUBLIC_STORE_PINCODE=121006
```

**Optional:**
- `SHIPROCKET_MOCK_MODE` - Removed (no longer used)

## Testing

### Test COD Order:
1. Add products to cart
2. Go to checkout
3. Select COD payment method
4. Enter delivery details
5. Validate pincode is serviceable
6. Complete checkout
7. Order should be automatically shipped

### Test Razorpay Order:
1. Add products to cart
2. Go to checkout
3. Select Razorpay payment method
4. Enter delivery details
5. Validate pincode is serviceable
6. Complete checkout
7. Complete Razorpay payment
8. Order should be automatically shipped

### Verify Shipping:
- Check order status in admin dashboard
- Should show 'shipped' status
- Should have AWB code and courier name
- Delivery record should have tracking number

## Benefits

1. **Automated Workflow:** No manual intervention needed for order shipping
2. **Faster Fulfillment:** Orders shipped immediately after payment
3. **Cost Optimization:** Automatically selects cheapest courier
4. **Real-time Tracking:** AWB codes available immediately
5. **Reduced Errors:** Eliminates manual order creation mistakes
6. **Better UX:** Customers get tracking info immediately

## Troubleshooting

**Issue:** "No shipping rates available for this pincode"
- **Solution:** Pincode not serviceable by any courier. Contact Shiprocket support.

**Issue:** "Failed to create Shiprocket order"
- **Solution:** Check Shiprocket account configuration (pickup location, courier partners)
- **Solution:** Verify API key is valid and not expired

**Issue:** Order created but not shipped
- **Solution:** Check server logs for Shiprocket API errors
- **Solution:** Manually ship using admin dashboard

## Future Enhancements

1. Courier preference selection (let customers choose courier)
2. Scheduled shipping (ship at specific time)
3. Batch shipping (ship multiple orders together)
4. Webhook integration (real-time tracking updates)
5. Return order handling
6. Multi-warehouse support
